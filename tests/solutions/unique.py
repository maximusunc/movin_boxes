def solve(labels):
    last = {}  # label -> index where it was last seen
    left = 0
    best = 0
    for right, ch in enumerate(labels):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best
