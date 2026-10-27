class NumArray:
    def __init__(self, nums):
        self.vals = list(nums)
        self.n = len(self.vals)
        self.tree = [0] * (self.n + 1)
        for i, v in enumerate(self.vals):
            self._add(i, v)

    def _add(self, i, delta):
        i += 1
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def _prefix(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & -i
        return s

    def update(self, i, val):
        self._add(i, val - self.vals[i])
        self.vals[i] = val

    def sum_range(self, l, r):
        return self._prefix(r + 1) - self._prefix(l)
