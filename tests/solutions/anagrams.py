def solve(labels):
    groups = {}
    for label in labels:
        key = "".join(sorted(label))
        groups.setdefault(key, []).append(label)
    return list(groups.values())
