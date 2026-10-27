def solve(weights, k):
    n = len(weights)
    count = 0
    for i in range(n):
        total = 0
        for j in range(i, n):
            total += weights[j]
            if total == k:
                count += 1
    return count
