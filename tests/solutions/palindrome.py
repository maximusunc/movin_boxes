def solve(label):
    left, right = 0, len(label) - 1
    while left < right:
        a = label[left]
        if not a.isalnum():
            left += 1
            continue
        b = label[right]
        if not b.isalnum():
            right -= 1
            continue
        if a.lower() != b.lower():
            return False
        left += 1
        right -= 1
    return True
