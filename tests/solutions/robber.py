def solve(values):
    take, skip = 0, 0
    for v in values:
        take, skip = skip + v, max(take, skip)
    return max(take, skip)
