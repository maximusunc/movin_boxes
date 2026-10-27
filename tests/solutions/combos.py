def solve(n, k):
    res = []
    path = []

    def backtrack(start):
        if len(path) == k:
            res.append(path[:])
            return
        for x in range(start, n - (k - len(path)) + 2):
            path.append(x)
            backtrack(x + 1)
            path.pop()

    backtrack(1)
    return res
