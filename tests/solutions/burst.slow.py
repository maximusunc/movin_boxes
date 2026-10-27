def solve(crates):
    def best(left_over):
        if not left_over:
            return 0
        top = 0
        for k, i in enumerate(left_over):
            left = crates[left_over[k - 1]] if k > 0 else 1
            right = crates[left_over[k + 1]] if k + 1 < len(left_over) else 1
            top = max(top, left * crates[i] * right + best(left_over[:k] + left_over[k + 1:]))
        return top

    return best(list(range(len(crates))))
