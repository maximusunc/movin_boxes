def solve(heights):
    n = len(heights)
    best = 0
    for i in range(n):
        low = float("inf")
        for j in range(i, n):
            low = min(low, heights[j])
            best = max(best, low * (j - i + 1))
    return best
