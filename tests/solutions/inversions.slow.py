def solve(weights):
    count = 0
    for i in range(len(weights)):
        for j in range(i + 1, len(weights)):
            if weights[i] > weights[j]:
                count += 1
    return count
