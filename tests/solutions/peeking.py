class PeekingIterator:
    def __init__(self, items):
        self.items = items
        self.i = 0
        self.has = len(items) > 0
        self.peeked = items[0] if self.has else None

    def peek(self):
        return self.peeked

    def next(self):
        out = self.peeked
        self.i += 1
        self.has = self.i < len(self.items)
        self.peeked = self.items[self.i] if self.has else None
        return out

    def has_next(self):
        return self.has
