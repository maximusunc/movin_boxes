import heapq


def solve(racks):
    events = []
    for left, right, height in racks:
        events.append((left, -height, right))  # a rack starts
        events.append((right, 0, 0))           # a rack may end here
    events.sort()
    live = [(0, float("inf"))]  # max-heap of (-height, right edge); the floor never ends
    out = []
    i = 0
    while i < len(events):
        x = events[i][0]
        while i < len(events) and events[i][0] == x:
            if events[i][1]:
                heapq.heappush(live, (events[i][1], events[i][2]))
            i += 1
        while live[0][1] <= x:
            heapq.heappop(live)
        h = -live[0][0]
        if not out or out[-1][1] != h:
            out.append((x, h))
    return out
