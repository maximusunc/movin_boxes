class AutocompleteSystem:
    def __init__(self, products):
        self.products = products

    def suggest(self, prefix):
        return sorted(p for p in self.products if p.startswith(prefix))[:3]
