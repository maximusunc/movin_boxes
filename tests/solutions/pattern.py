def solve(label, code):
    m, n = len(code), len(label)
    if m == 0:
        return 0
    lps = [0] * m
    k = 0
    for i in range(1, m):
        c = code[i]
        while k and c != code[k]:
            k = lps[k - 1]
        if c == code[k]:
            k += 1
        lps[i] = k
    j = 0
    for i in range(n):
        c = label[i]
        while j and c != code[j]:
            j = lps[j - 1]
        if c == code[j]:
            j += 1
            if j == m:
                return i - m + 1
    return -1
