def solve(words, width):
    words = list(words)
    lines = []
    i = 0
    while i < len(words):
        j, length = i, 0
        while j < len(words) and length + len(words[j]) + (j - i) <= width:
            length += len(words[j])
            j += 1
        gaps = j - i - 1
        if j == len(words) or gaps == 0:
            line = " ".join(words[i:j])
            lines.append(line + " " * (width - len(line)))
        else:
            spaces = width - length
            each, extra = divmod(spaces, gaps)
            line = ""
            for k in range(i, j - 1):
                line += words[k] + " " * (each + (1 if k - i < extra else 0))
            lines.append(line + words[j - 1])
        i = j
    return lines
