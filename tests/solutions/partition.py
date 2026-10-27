def solve(weights):
    total = sum(weights)
    if total % 2:
        return False
    target = total // 2
    sums = {0}
    for w in weights:
        sums |= {s + w for s in sums if s + w <= target}
    return target in sums
