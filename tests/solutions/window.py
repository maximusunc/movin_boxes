from collections import deque


def solve(weights, k):
    dq = deque()  # indices whose weights decrease from front to back
    res = []
    for i in range(len(weights)):
        w = weights[i]
        while dq and weights[dq[-1]] <= w:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(weights[dq[0]])
    return res
