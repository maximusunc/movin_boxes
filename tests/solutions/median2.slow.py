def solve(a, b):
    merged = sorted(list(a) + list(b))
    n = len(merged)
    if n % 2:
        return merged[n // 2]
    return (merged[n // 2 - 1] + merged[n // 2]) / 2
