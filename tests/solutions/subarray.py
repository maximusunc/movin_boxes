def solve(weights, k):
    seen = {0: 1}  # prefix sum -> how many times it has occurred
    total = 0
    count = 0
    for w in weights:
        total += w
        count += seen.get(total - k, 0)
        seen[total] = seen.get(total, 0) + 1
    return count
