import heapq


def solve(heads):
    heap = []
    for i, node in enumerate(heads):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode(0)
    tail = dummy
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        nxt = node.next
        if nxt:
            heapq.heappush(heap, (nxt.val, i, nxt))
    tail.next = None
    return dummy.next
