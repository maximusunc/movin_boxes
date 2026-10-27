def solve(weights, k):
    used = set()
    best = None
    for _ in range(k):
        best_i = -1
        for i in range(len(weights)):
            if i not in used and (best_i < 0 or weights[i] > weights[best_i]):
                best_i = i
        used.add(best_i)
        best = weights[best_i]
    return best
