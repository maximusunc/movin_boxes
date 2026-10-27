def solve(head):
    # Correct but O(n^2): walk from the current cart to find the tail every time.
    cur = head
    while cur and cur.next and cur.next.next:
        prev = cur
        while prev.next.next:
            prev = prev.next
        tail = prev.next
        prev.next = None
        tail.next = cur.next
        cur.next = tail
        cur = tail.next
    return head
