from collections import deque


class HitCounter:
    def __init__(self):
        self.hits = deque()

    def hit(self, t):
        self.hits.append(t)

    def count(self, t):
        while self.hits and self.hits[0] <= t - 300:
            self.hits.popleft()
        return len(self.hits)
