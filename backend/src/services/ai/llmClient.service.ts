import { aiConfig } from '../../config';

interface OpenRouterResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
}

export class LLMServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = 'LLMServiceError';
    this.statusCode = statusCode;
  }
}

interface JsonGenerationOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
}

/**
 * Try to extract a JSON object from a free-form text response.
 * Handles cases where models wrap JSON in markdown code fences or include
 * extra text around it.
 */
function extractJsonObject(text: string): unknown | null {
  if (!text) return null;

  // First try direct parse
  try {
    return JSON.parse(text);
  } catch {
    // Continue with other strategies
  }

  // Try to find a ```json``` block
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      // Fall through
    }
  }

  // Try to find the first { ... last } block
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Fall through
    }
  }

  return null;
}

export async function generateJson<T>(options: JsonGenerationOptions): Promise<T> {
  const { apiKey, baseUrl, model } = aiConfig.openrouter;
  if (!apiKey) {
    throw new LLMServiceError('OpenRouter is not configured. Set ANTHROPIC_AUTH_TOKEN before using AI features.', 503);
  }

  const endpoint = `${baseUrl}/v1/chat/completions`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), aiConfig.openrouter.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: options.systemPrompt + '\n\nIMPORTANT: Respond with ONLY a valid JSON object. No prose, no markdown, no code fences.' },
            { role: 'user', content: options.userPrompt }
          ],
          temperature: options.temperature,
          max_tokens: aiConfig.openrouter.maxOutputTokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const message = `OpenRouter returned HTTP ${response.status}: ${errorText.substring(0, 200)}`;
        if ((response.status === 429 || response.status >= 500) && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
          continue;
        }
        throw new LLMServiceError(message, response.status >= 500 ? 502 : response.status);
      }

      const payload = await response.json() as OpenRouterResponse;
      const text = payload.choices?.[0]?.message?.content;
      if (!text) throw new LLMServiceError('OpenRouter returned an empty response.');

      const parsed = extractJsonObject(text);
      if (parsed === null) {
        throw new LLMServiceError('OpenRouter returned invalid JSON.');
      }
      return parsed as T;
    } catch (error) {
      lastError = error;
      if (error instanceof LLMServiceError && error.statusCode < 500) throw error;
      if (attempt === 2) break;
    } finally {
      clearTimeout(timeout);
    }
  }

  if (lastError instanceof LLMServiceError) throw lastError;
  throw new LLMServiceError('OpenRouter could not be reached.');
}