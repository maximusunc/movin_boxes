class PeekingIterator:
    def __init__(self, items):
        self.items = items
        self.taken = 0

    def _at(self, k):
        # Walk from the start every time to find item k.
        for j, x in enumerate(self.items):
            if j == k:
                return x
        return None

    def peek(self):
        return self._at(self.taken)

    def next(self):
        x = self._at(self.taken)
        self.taken += 1
        return x

    def has_next(self):
        return self.taken < len(self.items)
