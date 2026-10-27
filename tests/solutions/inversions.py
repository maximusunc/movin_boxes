def solve(weights):
    a = list(weights)

    def sort(lo, hi):
        if hi - lo <= 1:
            return 0
        mid = (lo + hi) // 2
        count = sort(lo, mid) + sort(mid, hi)
        merged = []
        i, j = lo, mid
        while i < mid and j < hi:
            if a[i] <= a[j]:
                merged.append(a[i])
                i += 1
            else:
                merged.append(a[j])
                count += mid - i
                j += 1
        merged.extend(a[i:mid])
        merged.extend(a[j:hi])
        a[lo:hi] = merged
        return count

    return sort(0, len(a))
