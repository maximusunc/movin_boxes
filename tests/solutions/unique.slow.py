def solve(labels):
    n = len(labels)
    best = 0
    for i in range(n):
        seen = set()
        for j in range(i, n):
            ch = labels[j]
            if ch in seen:
                break
            seen.add(ch)
        best = max(best, len(seen))
    return best
