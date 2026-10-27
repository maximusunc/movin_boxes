from collections import Counter


def solve(jobs, n):
    counts = Counter(jobs)
    top = max(counts.values()) if counts else 0
    ties = sum(1 for c in counts.values() if c == top)
    return max(len(jobs), (top - 1) * (n + 1) + ties)
