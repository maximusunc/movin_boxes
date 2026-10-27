def solve(heights):
    stack = []  # indices with increasing heights
    best = 0
    n = len(heights)
    hs = []
    for i in range(n + 1):
        h = heights[i] if i < n else 0
        hs.append(h)
        while stack and hs[stack[-1]] >= h:
            top = stack.pop()
            left = stack[-1] + 1 if stack else 0
            best = max(best, hs[top] * (i - left))
        stack.append(i)
    return best
