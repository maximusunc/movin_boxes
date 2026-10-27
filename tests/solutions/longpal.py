def solve(label):
    n = len(label)
    best, start = 0, 0
    for center in range(2 * n - 1):
        left = center // 2
        right = left + center % 2
        while left >= 0 and right < n and label[left] == label[right]:
            left -= 1
            right += 1
        if right - left - 1 > best:
            best, start = right - left - 1, left + 1
    return label[start:start + best]
