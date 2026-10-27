def solve(weights, k):
    return [max(weights[i:i + k]) for i in range(len(weights) - k + 1)]
