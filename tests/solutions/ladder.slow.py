from collections import deque


def solve(start, goal, codes):
    if goal not in codes:
        return 0
    seen = {start}
    queue = deque([(start, 1)])
    while queue:
        word, steps = queue.popleft()
        if word == goal:
            return steps
        for code in codes:
            diff = sum(1 for a, b in zip(word, code) if a != b)
            if diff == 1 and code not in seen:
                seen.add(code)
                queue.append((code, steps + 1))
    return 0
