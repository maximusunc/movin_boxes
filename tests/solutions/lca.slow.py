def solve(root, p, q):
    # Ignores the BST ordering: finds both routes with a full depth-first search.
    def path_to(node, target, path):
        if node is None:
            return None
        path = path + [node.val]
        if path[-1] == target:
            return path
        return path_to(node.left, target, path) or path_to(node.right, target, path)

    a, b = path_to(root, p, []), path_to(root, q, [])
    meet = None
    for x, y in zip(a, b):
        if x != y:
            break
        meet = x
    return meet
