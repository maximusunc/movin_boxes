def solve(heads):
    heads = list(heads)
    dummy = ListNode(0)
    tail = dummy
    while True:
        best = -1
        for i in range(len(heads)):
            if heads[i] and (best < 0 or heads[i].val < heads[best].val):
                best = i
        if best < 0:
            break
        tail.next = heads[best]
        tail = heads[best]
        heads[best] = heads[best].next
    return dummy.next
