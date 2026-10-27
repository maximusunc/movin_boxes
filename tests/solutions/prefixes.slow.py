def solve(barcodes, prefixes):
    counts = []
    for p in prefixes:
        counts.append(sum(1 for code in barcodes if code.startswith(p)))
    return counts
