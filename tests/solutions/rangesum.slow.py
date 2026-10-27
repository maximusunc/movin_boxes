class NumArray:
    def __init__(self, nums):
        self.nums = nums
        self.changed = {}

    def update(self, i, val):
        self.changed[i] = val

    def sum_range(self, l, r):
        return sum(self.changed.get(i, self.nums[i]) for i in range(l, r + 1))
