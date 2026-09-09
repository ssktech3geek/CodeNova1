/**
 * @file INSTRUCTIONS.md (supplemental)
 * @module tests/unit
 * @description Instructions for Unit Test Coverage Requirements.
 *
 * UNIT TESTS TO WRITE (per service / utility):
 *
 * backend/utils/priceCalculator.util.test.ts
 *   - calculateCustomerPrice: verify correct summation and tax application.
 *   - calculateOperatorMargin: verify margin = customerPrice - supplierCost - charges.
 *   - calculateRefundAmount: verify 100% refund if cancelled 24h before; 50% if 12h before; 0% otherwise.
 *
 * backend/utils/dependencyGraph.util.test.ts
 *   - buildDependencyGraph: creates correct adjacency map from items.
 *   - traverseImpacted: BFS returns all transitively dependent items.
 *   - detectCircularDependencies: detects cycle in graph, passes valid DAG.
 *   - calculateFreeTimeSlots: returns correct free windows after removing items.
 *
 * backend/utils/scheduleValidator.util.test.ts
 *   - isScheduleFeasible: passes valid schedule; fails if travel + buffer exceeds gap.
 *   - detectScheduleOverlaps: detects overlapping time windows.
 *   - checkOpeningHoursCompliance: fails items scheduled outside hours.
 *
 * backend/utils/approvalRouter.util.test.ts
 *   - Low impact → TRAVELER only.
 *   - Cost change > 0 → TRAVELER + OPERATOR.
 *   - Margin impact > threshold → TRAVELER + OPERATOR + ADMIN.
 *   - canAutoApprove: returns false for all OPERATOR/ADMIN approval required cases.
 *
 * ai-ml/services/preferenceExtractor.service.test.ts
 *   - Returns structured preferences from natural language input (mocked LLM response).
 *   - Returns clarification_questions for ambiguous input.
 *   - Validates required fields.
 *
 * TESTING FRAMEWORK: Jest + ts-jest
 * COVERAGE TARGET: >= 80% line coverage on utils and service business logic.
 */
