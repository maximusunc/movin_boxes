def solve(head):
    if head is None or head.next is None:
        return head
    # find the middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    # reverse the second half
    prev = None
    cur = slow.next
    slow.next = None
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    # weave the two halves together
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
    return head
