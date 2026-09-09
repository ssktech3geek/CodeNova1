import { ItineraryItem } from '../types';

// ============================================
// Dependency Graph & BFS Disruption Traversal
// Itinerary represented as a DAG of ItineraryItems
// ============================================

/**
 * Build an adjacency map from itinerary items' dependency lists.
 * adjacencyMap[itemId] = [dependentItemId, ...]
 */
export function buildAdjacencyMap(items: ItineraryItem[]): Map<string, string[]> {
  const adjacencyMap = new Map<string, string[]>();

  // Initialize all nodes
  for (const item of items) {
    if (!adjacencyMap.has(item.id)) {
      adjacencyMap.set(item.id, []);
    }
  }

  // Build edges: if B depends on A, then A → B
  for (const item of items) {
    if (item.dependencies && item.dependencies.length > 0) {
      for (const depId of item.dependencies) {
        if (!adjacencyMap.has(depId)) {
          adjacencyMap.set(depId, []);
        }
        adjacencyMap.get(depId)!.push(item.id);
      }
    }
  }

  return adjacencyMap;
}

/**
 * BFS traversal from a disrupted root node to find all transitively
 * impacted items in the dependency graph.
 */
export function findImpactedItems(
  rootItemId: string,
  adjacencyMap: Map<string, string[]>
): string[] {
  const visited = new Set<string>();
  const queue: string[] = [rootItemId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const dependents = adjacencyMap.get(current) || [];
    for (const dep of dependents) {
      if (!visited.has(dep)) {
        queue.push(dep);
      }
    }
  }

  // Exclude the root itself — it's the disruption source, not an "impacted" downstream node
  visited.delete(rootItemId);
  return Array.from(visited);
}

/**
 * Full disruption analysis:
 * 1. Build adjacency map from items
 * 2. BFS from disrupted root
 * 3. Return structured impact report
 */
export interface DisruptionImpact {
  rootItemId: string;
  impactedItemIds: string[];
  totalImpactedCount: number;
  freeTimeStart: Date | null;
  freeTimeEnd: Date | null;
  freeTimeMinutes: number;
}

export function analyzeDisruption(
  rootItemId: string,
  allItems: ItineraryItem[]
): DisruptionImpact {
  const adjacencyMap = buildAdjacencyMap(allItems);
  const impactedItemIds = findImpactedItems(rootItemId, adjacencyMap);

  // Find free time window: from root item start to latest impacted item end
  const rootItem = allItems.find((i) => i.id === rootItemId);
  const impactedItems = allItems.filter((i) => impactedItemIds.includes(i.id));

  let freeTimeStart: Date | null = rootItem?.start_time ?? null;
  let freeTimeEnd: Date | null = null;
  let freeTimeMinutes = 0;

  if (rootItem && impactedItems.length > 0) {
    const latestEnd = impactedItems.reduce((latest, item) => {
      return item.end_time > latest ? item.end_time : latest;
    }, rootItem.end_time);

    freeTimeEnd = latestEnd;
    freeTimeMinutes = Math.floor(
      (latestEnd.getTime() - rootItem.start_time.getTime()) / (60 * 1000)
    );
  } else if (rootItem) {
    freeTimeEnd = rootItem.end_time;
    freeTimeMinutes = Math.floor(
      (rootItem.end_time.getTime() - rootItem.start_time.getTime()) / (60 * 1000)
    );
  }

  return {
    rootItemId,
    impactedItemIds,
    totalImpactedCount: impactedItemIds.length,
    freeTimeStart,
    freeTimeEnd,
    freeTimeMinutes,
  };
}

/**
 * Topological sort of itinerary items using Kahn's algorithm (BFS-based).
 * Returns items in execution order respecting dependencies.
 */
export function topologicalSort(items: ItineraryItem[]): ItineraryItem[] {
  const inDegree = new Map<string, number>();
  const adjacencyMap = new Map<string, string[]>();

  for (const item of items) {
    if (!inDegree.has(item.id)) inDegree.set(item.id, 0);
    if (!adjacencyMap.has(item.id)) adjacencyMap.set(item.id, []);
  }

  for (const item of items) {
    if (item.dependencies) {
      for (const depId of item.dependencies) {
        if (!adjacencyMap.has(depId)) adjacencyMap.set(depId, []);
        adjacencyMap.get(depId)!.push(item.id);
        inDegree.set(item.id, (inDegree.get(item.id) || 0) + 1);
      }
    }
  }

  const queue = items.filter((i) => (inDegree.get(i.id) || 0) === 0);
  const sorted: ItineraryItem[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighborId of adjacencyMap.get(current.id) || []) {
      const newDegree = (inDegree.get(neighborId) || 0) - 1;
      inDegree.set(neighborId, newDegree);
      if (newDegree === 0) {
        const neighborItem = items.find((i) => i.id === neighborId);
        if (neighborItem) queue.push(neighborItem);
      }
    }
  }

  return sorted;
}

/**
 * Detect circular dependencies in an itinerary (DAG validation).
 * Returns true if the graph is acyclic (valid), false if cyclic.
 */
export function isAcyclic(items: ItineraryItem[]): boolean {
  return topologicalSort(items).length === items.length;
}
