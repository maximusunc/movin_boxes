def solve(weights, queries):
    out = []
    for l, r in queries:
        total = 0
        for i in range(l, r + 1):
            total += weights[i]
        out.append(total)
    return out
