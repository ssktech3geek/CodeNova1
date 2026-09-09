/**
 * @file ai.config.ts
 * @module backend/config
 * @description Configuration specifications for AI / LLM Gateway and Reasoning Engine.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Model Configuration:
 *    - Model ID selection (e.g. Gemini 3.5 / Gemini 3.6 Pro / Flash).
 *    - Temperature settings (0.1 for intent extraction & constraint verification; 0.7 for conversational Q&A).
 *    - Max token limits and timeout thresholds.
 * 2. Tool Calling Boundary:
 *    - JSON schema definitions for tools: extract_preferences, search_services, check_constraints, calculate_price, analyze_change_impact.
 * 3. AI Safety & Validation Policy:
 *    - Strictly prohibit hallucinated prices or availability.
 *    - Mandatory backend validation wrapper before committing any AI-proposed action.
 * 
 * PARAMETERS:
 * - AI_MODEL_PRIMARY: string
 * - AI_MODEL_FAST: string
 * - AI_TEMPERATURE_STRICT: number (0.0 - 0.2)
 * - AI_TEMPERATURE_CREATIVE: number (0.6 - 0.8)
 * - AI_TIMEOUT_MS: number (default: 15000)
 */
