def solve(items, capacity):
    def best(i, room):
        if i == len(items):
            return 0
        w, v = items[i]
        skip = best(i + 1, room)
        if w <= room:
            return max(skip, v + best(i + 1, room - w))
        return skip

    return best(0, capacity)
