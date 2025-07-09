export class Tree {
  constructor({ title, description }) {
    this.title = title;
    this.description = description;
    this.complete = false;
    this.children = [];
  }
  addChildren(...children) {
    for (const child of children) {
      this.children.push(new Tree(child));
    }
  }
  toFlow() {
    let result = { nodes: [], edges: [] };
    let queue = [0, this];
    let row;
    let cols;
    let i;

    while (queue.length) {
      let node = queue.shift();
      if (typeof node == "number") {
        row = node;
        cols = queue.length;
        i = 0;
        if (queue.length) queue.push(row + 1);
        continue;
      }

      let type = "end";
      let id = row.toString() + "_" + i.toString();
      for (const child of node.children) {
        type = "node";
        queue.push({...child, parent: id });
      }
      delete node.children;

      if (node.parent) {
        result.edges.push({
          id: node.parent + "-" + id,
          type: "edge",
          source: node.parent,
          target: id
        });
      } else type = "start";
      delete node.parent;

      result.nodes.push({
        id,
        position: { x: 600 * (i - (cols / 2 - 0.5)), y: 400 * row },
        type,
        data: node
      });
      i++;
    }

    return result;
  }
}