def solve(weights):
    total = sum(weights)
    if total % 2:
        return False

    def can(i, left):
        if left == 0:
            return True
        if i == len(weights) or left < 0:
            return False
        return can(i + 1, left - weights[i]) or can(i + 1, left)

    return can(0, total // 2)
