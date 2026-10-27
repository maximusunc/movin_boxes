from collections import deque


def solve(root):
    if root is None:
        return []
    levels = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            left, right = node.left, node.right
            if left:
                queue.append(left)
            if right:
                queue.append(right)
        levels.append(level)
    return levels
