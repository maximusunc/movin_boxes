def solve(heights):
    n = len(heights)
    water = 0
    for i in range(n):
        left_max = max(heights[j] for j in range(i + 1))
        right_max = max(heights[j] for j in range(i, n))
        water += min(left_max, right_max) - heights[i]
    return water
