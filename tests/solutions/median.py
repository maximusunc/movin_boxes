import heapq


def solve(weights):
    low = []   # max-heap (negated) of the lighter half
    high = []  # min-heap of the heavier half
    medians = []
    for w in weights:
        heapq.heappush(low, -w)
        heapq.heappush(high, -heapq.heappop(low))
        if len(high) > len(low):
            heapq.heappush(low, -heapq.heappop(high))
        if len(low) > len(high):
            medians.append(-low[0])
        else:
            medians.append((-low[0] + high[0]) / 2)
    return medians
