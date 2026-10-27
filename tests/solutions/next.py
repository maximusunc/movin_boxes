def solve(weights):
    n = len(weights)
    ans = [0] * n
    stack = []
    for i in range(n):
        w = weights[i]
        while stack and stack[-1][1] < w:
            j, _ = stack.pop()
            ans[j] = i - j
        stack.append((i, w))
    return ans
