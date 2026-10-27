def solve(barcodes, prefixes):
    root = {"count": 0}  # each trie node: child letters -> node, plus how many barcodes pass through
    for code in barcodes:
        node = root
        node["count"] += 1
        for ch in code:
            node = node.setdefault(ch, {"count": 0})
            node["count"] += 1
    counts = []
    for p in prefixes:
        node = root
        for ch in p:
            node = node.get(ch)
            if node is None:
                break
        counts.append(node["count"] if node else 0)
    return counts
