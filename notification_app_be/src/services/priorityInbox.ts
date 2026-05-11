import { BinaryHeap } from "../utils/heap";
import type { Notification, NotificationType } from "../types/notification";

const typeWeight: Record<NotificationType, number> = {
  PLACEMENT: 3,
  RESULT: 2,
  EVENT: 1,
};

const comparePriority = (a: Notification, b: Notification) => {
  const wa = typeWeight[a.type];
  const wb = typeWeight[b.type];

  if (wa !== wb) return wa - wb; // smaller = less priority

  const ta = new Date(a.createdAt).getTime();
  const tb = new Date(b.createdAt).getTime();
  return ta - tb; // older = less priority
};

/**
 * Select top K notifications by:
 * 1) Type priority: PLACEMENT > RESULT > EVENT
 * 2) Recency within same type
 *
 * Time: O(n log k)
 * Space: O(k)
 */
export const selectPriorityTopK = (
  notifications: Notification[],
  k: number = 10
): Notification[] => {
  const limit = Math.max(0, Math.floor(k));
  if (limit === 0) return [];

  // Min-heap holds the current top-K; root is the "worst" among chosen.
  const heap = new BinaryHeap<Notification>(comparePriority);

  for (const n of notifications) {
    heap.push(n);
    if (heap.size() > limit) heap.pop();
  }

  // Heap is unsorted; sort descending for response.
  return heap
    .toArray()
    .sort((a, b) => -comparePriority(a, b));
};
