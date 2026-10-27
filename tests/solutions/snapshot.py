import bisect


class SnapshotArray:
    def __init__(self, length):
        self.history = [[(-1, 0)] for _ in range(length)]
        self.snap_id = 0

    def set(self, i, val):
        h = self.history[i]
        if h[-1][0] == self.snap_id:
            h[-1] = (self.snap_id, val)
        else:
            h.append((self.snap_id, val))

    def snap(self):
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, i, snap_id):
        h = self.history[i]
        k = bisect.bisect_right(h, (snap_id, float("inf")))
        return h[k - 1][1]
