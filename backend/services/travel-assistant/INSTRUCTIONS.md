# Travel Assistant - Instructions

## Purpose
AI-powered conversational interface for travelers and operators, handling natural language understanding, itinerary Q&A, preference extraction, and decision explanation.

## Core Responsibilities
1. **Natural Language Understanding**
   - Extract structured preferences from conversational input
   - Identify intent: plan, modify, query, complain, emergency
   - Handle multi-turn conversations with context

2. **Preference Extraction**
   - Convert: "Plan a relaxed 4-day Goa trip for 2 under ₹45k with beaches, local food, light adventure, boutique hotel, private transport, no nightlife"
   - To structured JSON with all preference fields
   - Handle ambiguity with clarifying questions

3. **Itinerary Q&A**
   - Answer questions about itinerary: "What time is my pickup?", "Can I change the hotel?", "What if it rains?"
   - Explain itinerary decisions and trade-offs
   - Provide real-time updates during trip

4. **Decision Explanation**
   - Explain why specific recommendations were made
   - Explain disruption alternatives and trade-offs
   - Translate technical constraints to traveler language

5. **Summarization**
   - Summarize itinerary changes after disruption
   - Daily briefing for travelers
   - Operator incident summaries

6. **Translation & Localization**
   - Multi-language support for international travelers
   - Currency, date, time localization

## AI Tool-Calling Capabilities
- `extract_preferences(natural_language)` → structured preferences
- `search_services(criteria)` → candidate services
- `get_availability(service_ids, dates)` → real-time availability
- `calculate_route(origin, destination, mode)` → travel time/distance
- `check_constraints(itinerary)` → validation results
- `calculate_price(itinerary)` → pricing breakdown
- `analyze_change_impact(event, itinerary)` → impact analysis
- `generate_alternatives(impact_analysis)` → replacement options
- `explain_tradeoffs(alternatives)` → structured explanations
- `request_approval(change_proposal)` → approval workflow
- `summarize_update(old_itinerary, new_itinerary)` → change summary

## Conversation Flow Examples
**Planning**: User describes trip → Assistant extracts preferences → Confirms understanding → Triggers itinerary generation → Presents options
**Disruption**: Event detected → Assistant notified → Summarizes impact → Presents alternatives → Explains trade-offs → Gets approval → Confirms update
**Q&A**: User asks question → Assistant retrieves context → Provides answer with sources

## API Endpoints
- `POST /assistant/chat` - Conversational interface
- `POST /assistant/extract-preferences` - Extract preferences from text
- `POST /assistant/explain` - Explain recommendation/decision
- `POST /assistant/summarize` - Summarize changes
- `GET /assistant/history/:sessionId` - Conversation history
- `POST /assistant/translate` - Translate content

## Integration Points
- **Profile Service**: Store extracted preferences
- **Recommendation Engine**: Search services
- **Itinerary Service**: Access itinerary for Q&A
- **Constraint Checker**: Validate constraints
- **Pricing Service**: Price calculations
- **Dynamic Replanner**: Generate alternatives
- **Operations Service**: Real-time updates
- **Notification Service**: Proactive communications

## Key Constraints
- AI proposes, backend validates, human approves (when required)
- Never fabricate prices, availability, or operational data
- All tool calls must hit authoritative backend services
- Conversation context must be maintained
- Escalation to human operator for complex issues
- Privacy: no PII in training/logs