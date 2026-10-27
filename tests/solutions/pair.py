def solve(weights, capacity):
    seen = {}
    for i, w in enumerate(weights):
        if capacity - w in seen:
            return (seen[capacity - w], i)
        seen[w] = i
    return None
