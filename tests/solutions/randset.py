import random


class RandomizedSet:
    def __init__(self):
        self.items = []
        self.pos = {}

    def insert(self, x):
        if x in self.pos:
            return False
        self.pos[x] = len(self.items)
        self.items.append(x)
        return True

    def remove(self, x):
        if x not in self.pos:
            return False
        i, last = self.pos[x], self.items[-1]
        self.items[i] = last
        self.pos[last] = i
        self.items.pop()
        del self.pos[x]
        return True

    def get_random(self):
        return random.choice(self.items)
