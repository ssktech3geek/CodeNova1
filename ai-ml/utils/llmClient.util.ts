/*
@file llmClient.util.ts
@module ai-ml/utils
@description Instructions for LLM API Client Wrapper Utility.

PURPOSE:
Provide a centralized, safe wrapper around the LLM API with retry logic, token management,
structured output enforcement, and safety guardrails.

FUNCTIONS TO IMPLEMENT (no code here):

1. callLLM(options: LLMCallOptions): Promise<LLMResponse>
   - options: { prompt, systemPrompt, temperature, maxTokens, jsonMode, tools }
   - Call the configured LLM model API.
   - Enforce JSON mode when jsonMode: true.
   - Handle: 429 rate-limit with exponential backoff (max 3 retries), timeout (AI_TIMEOUT_MS).
   - Log: model_used, token_usage, latency_ms, request_id in structured log.
   - Return: { content, tool_calls, finish_reason, token_usage }.

2. validateToolCallResult(toolName: string, result: unknown): ValidationResult
   - Validate that the tool call result conforms to the expected schema (from toolSchemas.model.ts).
   - Reject results that contain invented prices or availability claims.
   - Return ValidationResult: { valid, errors[] }.

3. buildConversationHistory(messages: Message[], maxTokens: number): Message[]
   - Apply sliding window to conversation history.
   - Trim oldest messages first while keeping system prompt.
   - Ensure total token count does not exceed maxTokens.

KEY CONSTRAINTS:
- ALL LLM calls must go through this utility; never call the LLM API directly from service files.
- Log every LLM call with token usage for cost monitoring.
- Never log full prompt content in production (may contain PII).
*/
