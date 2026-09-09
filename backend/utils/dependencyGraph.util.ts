/**
 * @file dependencyGraph.util.ts
 * @module backend/utils
 * @description Instructions for Itinerary Dependency Graph Traversal Utility.
 *
 * PURPOSE:
 * Model the itinerary as a directed dependency graph. Power the Change Impact Analyzer
 * and Replanning Engine with BFS/DFS traversal logic (Brain Sections 8, 10, 11).
 *
 * FUNCTIONS TO IMPLEMENT (no code here):
 *
 * 1. buildDependencyGraph(itineraryItems: ItineraryItem[]): DependencyGraph
 *    - Build adjacency map: itemId → [dependentItemIds].
 *    - Edges represent: transport→activity, activity→guide, activity→meal, activity→nextActivity.
 *    - Return an in-memory graph structure.
 *
 * 2. traverseImpacted(graph: DependencyGraph, rootItemId: UUID): UUID[]
 *    - BFS starting from the disrupted item.
 *    - Collect all transitively dependent item IDs.
 *    - Return list of all affected ItineraryItem IDs.
 *
 * 3. detectCircularDependencies(graph: DependencyGraph): boolean
 *    - Safety check; itinerary graphs must be DAGs (Directed Acyclic Graphs).
 *    - Return true if cycle detected (should raise validation error).
 *
 * 4. calculateFreeTimeSlots(itineraryItems: ItineraryItem[], affectedIds: UUID[]): TimeSlot[]
 *    - After removing affected items, compute resulting free time windows.
 *    - Used by Replanning Engine to find replacement candidates.
 *
 * KEY CONSTRAINTS:
 * - Must support optional Neo4j persistence for production graph traversal at scale.
 * - In-memory fallback for development/testing environments.
 */
