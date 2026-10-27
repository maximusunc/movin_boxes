class NestedIterator:
    def __init__(self, nested):
        # Stack of (list, next index) pairs; the top is the crate being unpacked.
        self.stack = [[nested, 0]]

    def _settle(self):
        while self.stack:
            items, i = self.stack[-1]
            if i == len(items):
                self.stack.pop()
                continue
            if isinstance(items[i], int):
                return True
            self.stack[-1][1] += 1
            self.stack.append([items[i], 0])
        return False

    def next(self):
        self._settle()
        items, i = self.stack[-1]
        self.stack[-1][1] += 1
        return items[i]

    def has_next(self):
        return self._settle()
