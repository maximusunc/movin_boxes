def solve(bookings):
    removed = 0
    end = float("-inf")
    for start, finish in sorted(bookings, key=lambda b: b[1]):
        if start >= end:
            end = finish
        else:
            removed += 1
    return removed
