class AutocompleteSystem:
    def __init__(self, products):
        # Each trie node keeps the first three words (alphabetically) below it.
        self.root = {"$top": []}
        for word in sorted(products):
            node = self.root
            if len(node["$top"]) < 3:
                node["$top"].append(word)
            for ch in word:
                node = node.setdefault(ch, {"$top": []})
                if len(node["$top"]) < 3:
                    node["$top"].append(word)

    def suggest(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node:
                return []
            node = node[ch]
        return list(node["$top"])
