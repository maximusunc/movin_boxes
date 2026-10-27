def solve(weights):
    weights = list(weights)
    res = []
    path = []

    def backtrack(i):
        res.append(path[:])
        for j in range(i, len(weights)):
            path.append(weights[j])
            backtrack(j + 1)
            path.pop()

    backtrack(0)
    return res
