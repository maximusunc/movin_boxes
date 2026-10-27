def solve(picks):
    last = {ch: i for i, ch in enumerate(picks)}
    sizes = []
    start = end = 0
    for i, ch in enumerate(picks):
        end = max(end, last[ch])
        if i == end:
            sizes.append(i - start + 1)
            start = i + 1
    return sizes
