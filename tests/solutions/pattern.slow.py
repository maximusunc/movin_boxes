def solve(label, code):
    m, n = len(code), len(label)
    for i in range(n - m + 1):
        j = 0
        while j < m and label[i + j] == code[j]:
            j += 1
        if j == m:
            return i
    return -1
