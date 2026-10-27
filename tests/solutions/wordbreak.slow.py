def solve(label, codes):
    def split(i):
        if i == len(label):
            return True
        for code in codes:
            if label[i:i + len(code)] == code and split(i + len(code)):
                return True
        return False

    return split(0)
