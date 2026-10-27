from collections import OrderedDict, defaultdict


class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.vals = {}
        self.freq = {}
        self.groups = defaultdict(OrderedDict)  # use count -> keys, oldest first
        self.min_freq = 0

    def _use(self, key):
        f = self.freq[key]
        del self.groups[f][key]
        if not self.groups[f]:
            del self.groups[f]
            if self.min_freq == f:
                self.min_freq = f + 1
        self.freq[key] = f + 1
        self.groups[f + 1][key] = None

    def get(self, key):
        if key not in self.vals:
            return -1
        self._use(key)
        return self.vals[key]

    def put(self, key, value):
        if self.capacity == 0:
            return
        if key in self.vals:
            self.vals[key] = value
            self._use(key)
            return
        if len(self.vals) >= self.capacity:
            old, _ = self.groups[self.min_freq].popitem(last=False)
            if not self.groups[self.min_freq]:
                del self.groups[self.min_freq]
            del self.vals[old]
            del self.freq[old]
        self.vals[key] = value
        self.freq[key] = 1
        self.groups[1][key] = None
        self.min_freq = 1
