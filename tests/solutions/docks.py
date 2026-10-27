import heapq


def solve(trucks):
    heap = []
    best = 0
    for arrive, leave in sorted(trucks):
        while heap and heap[0] <= arrive:
            heapq.heappop(heap)
        heapq.heappush(heap, leave)
        best = max(best, len(heap))
    return best
