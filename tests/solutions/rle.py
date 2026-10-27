def solve(label):
    out = []
    i = 0
    n = len(label)
    while i < n:
        ch = label[i]
        j = i + 1
        while j < n and label[j] == ch:
            j += 1
        out.append(ch + (str(j - i) if j - i > 1 else ""))
        i = j
    return "".join(out)
