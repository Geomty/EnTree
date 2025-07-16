export class Tree {
  constructor({ title, description }) {
    this.title = title;
    this.description = description;
    this.complete = false;
    this.children = [];
  }
  addChildren(children) {
    for (const child of children) {
      this.children.push(new Tree(child));
    }
  }
  findChild(id) {
    let arr = id.split("_").map(n => Number(n));
    arr.shift();
    let result = this;
    for (const i of arr) result = result.children[i];
    return result;
  }
  toFlow() {
    let result = { nodes: [], edges: [] };
    let queue = [0, JSON.parse(JSON.stringify(this))];
    let row;
    let cols;
    let i;

    while (queue.length) {
      let node = queue.shift();
      let id;
      let type = "end";

      if (typeof node == "number") {
        row = node;
        cols = queue.length;
        i = 0;
        if (queue.length) queue.push(row + 1);
        continue;
      }

      if (node.parent) {
        id = node.parent + "_" + node.i;
        result.edges.push({
          id: node.parent + "-" + id,
          type: "edge",
          source: node.parent,
          target: id
        });
      } else {
        type = "start";
        id = i.toString();
      }
      delete node.parent;
      delete node.i;

      for (const child of node.children) {
        if (type == "end") type = "node";
        queue.push({...child, parent: id, i: node.children.indexOf(child) });
      }
      delete node.children;

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