import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, withTransaction } from '../../lib/db';
import { authConfig } from '../../config';
import { User, AuthPayload, TokenPair, Role } from '../../types';

// ============================================
// Auth Service
// Handles registration, login, token management
// ============================================

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, 'password_hash'>;
  tokens: TokenPair;
}

/**
 * Register a new user with hashed password.
 */
export async function register(input: RegisterInput): Promise<AuthResult> {
  const { email, password, full_name, phone_number, role } = input;

  // Check for existing user
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    throw Object.assign(new Error('User with this email already exists.'), { code: 'USER_EXISTS' });
  }

  const password_hash = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  const userId = uuidv4();

  const result = await withTransaction(async (client: any) => {
    const userRow = await client.query(
      `INSERT INTO users (id, email, password_hash, role, phone_number, full_name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING id, email, role, phone_number, full_name, is_active, created_at, updated_at`,
      [userId, email, password_hash, role, phone_number, full_name]
    );

    // Create corresponding profile for traveler role
    if (role === 'TRAVELER') {
      await client.query(
        `INSERT INTO traveler_profiles (id, user_id, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())`,
        [uuidv4(), userId]
      );
    }

    // Audit log
    await client.query(
      `INSERT INTO audit_logs (id, actor_user_id, actor_role, action, entity_type, entity_id, ip_address, request_id, occurred_at)
       VALUES ($1, $2, $3, 'USER_REGISTERED', 'USER', $4, 'system', 'system', NOW())`,
      [uuidv4(), userId, role, userId]
    );

    return userRow.rows[0];
  });

  const user = result as Omit<User, 'password_hash'>;
  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });

  return { user, tokens };
}

/**
 * Authenticate a user with email and password.
 */
export async function login(input: LoginInput): Promise<AuthResult> {
  const { email, password } = input;

  const result = await query<User>(
    `SELECT id, email, password_hash, role, phone_number, full_name, is_active, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    throw Object.assign(new Error('Invalid email or password.'), { code: 'INVALID_CREDENTIALS' });
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw Object.assign(new Error('Your account has been deactivated.'), { code: 'ACCOUNT_INACTIVE' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw Object.assign(new Error('Invalid email or password.'), { code: 'INVALID_CREDENTIALS' });
  }

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });

  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, tokens };
}

/**
 * Refresh tokens using a valid refresh token.
 */
export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  try {
    const decoded = jwt.verify(refreshToken, authConfig.jwt.secret) as AuthPayload & { type: string };
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type.');
    }

    const result = await query<User>('SELECT id, email, role, is_active FROM users WHERE id = $1', [decoded.userId]);
    if (result.rowCount === 0 || !result.rows[0].is_active) {
      throw new Error('User not found or inactive.');
    }

    const user = result.rows[0];
    return generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  } catch (err) {
    throw Object.assign(new Error('Invalid or expired refresh token.'), { code: 'INVALID_REFRESH_TOKEN' });
  }
}

/**
 * Get user by ID (without password hash).
 */
export async function getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
  const result = await query<User>(
    `SELECT id, email, role, phone_number, full_name, is_active, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
}

// ============================================
// Internal Helpers
// ============================================
function generateTokenPair(payload: AuthPayload): TokenPair {
  const accessToken = jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.accessExpiry,
  } as any);

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    authConfig.jwt.secret,
    { expiresIn: authConfig.jwt.refreshExpiry } as any
  );

  return { accessToken, refreshToken };
}
