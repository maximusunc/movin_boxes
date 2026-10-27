from collections import deque


def solve(root):
    res = []
    queue = deque([root] if root else [])
    while queue:
        for i in range(len(queue)):
            node = queue.popleft()
            left, right = node.left, node.right
            if left:
                queue.append(left)
            if right:
                queue.append(right)
        res.append(node.val)
    return res
