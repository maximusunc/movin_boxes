def solve(weights, queries):
    prefix = [0]
    for w in weights:
        prefix.append(prefix[-1] + w)
    return [prefix[r + 1] - prefix[l] for l, r in queries]
