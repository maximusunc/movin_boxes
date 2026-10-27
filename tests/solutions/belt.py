def solve(weights, limit):
    left = 0
    total = 0
    best = None
    for right in range(len(weights)):
        total += weights[right]
        while total > limit and left <= right:
            total -= weights[left]
            left += 1
        if left <= right and (best is None or right - left > best[1] - best[0]):
            best = (left, right)
    return best
