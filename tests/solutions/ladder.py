from collections import deque


def solve(start, goal, codes):
    approved = set(codes)
    if goal not in approved:
        return 0
    seen = {start}
    queue = deque([(start, 1)])
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    while queue:
        word, steps = queue.popleft()
        if word == goal:
            return steps
        for i in range(len(word)):
            for ch in letters:
                nxt = word[:i] + ch + word[i + 1:]
                if nxt in approved and nxt not in seen:
                    seen.add(nxt)
                    queue.append((nxt, steps + 1))
    return 0
