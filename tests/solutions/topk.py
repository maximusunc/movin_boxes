import heapq


def solve(weights, k):
    heap = []
    for w in weights:
        heapq.heappush(heap, w)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap
