def solve(racks):
    xs = sorted(set(x for r in racks for x in (r[0], r[1])))
    out = []
    prev = 0
    for x in xs:
        h = 0
        for left, right, height in racks:
            if left <= x < right:
                h = max(h, height)
        if h != prev:
            out.append((x, h))
            prev = h
    return out
