def solve(weights, target):
    weights = sorted(weights)
    res = []
    path = []

    def go(start, remaining):
        if remaining == 0:
            res.append(path[:])
            return
        for i in range(start, len(weights)):
            if weights[i] > remaining:
                break
            path.append(weights[i])
            go(i + 1, remaining - weights[i])
            path.pop()

    go(0, target)
    return res
