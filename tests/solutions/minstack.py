class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []

    def push(self, x):
        self.stack.append(x)
        self.mins.append(x if not self.mins else min(x, self.mins[-1]))

    def pop(self):
        self.stack.pop()
        self.mins.pop()

    def top(self):
        return self.stack[-1]

    def get_min(self):
        return self.mins[-1]
