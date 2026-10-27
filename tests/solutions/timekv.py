import bisect


class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key, value, t):
        self.store.setdefault(key, ([], []))
        times, values = self.store[key]
        times.append(t)
        values.append(value)

    def get(self, key, t):
        if key not in self.store:
            return ""
        times, values = self.store[key]
        i = bisect.bisect_right(times, t)
        return values[i - 1] if i else ""
