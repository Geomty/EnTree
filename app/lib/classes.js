export class Tree {
  constructor({ title, description, position, complete, children }) {
    this.title = title;
    this.description = description;
    this.position = position;
    this.complete = complete;
    this.children = children;
  }
  addChildren(id, children) {
    const node = this.findChild(id);
    let i = 0;
    for (const child of children) {
      node.children.push({ ...child, position: { x: 600 * (i - (children.length / 2 - 0.5)) + node.position.x, y: 400 + node.position.y }, complete: false, children: [] });
      i++;
    }
  }
  findChild(id) {
    let arr = id.split("_").map(n => Number(n));
    arr.shift();
    let result = this;
    for (const i of arr) result = result.children[i];
    return result;
  }
  organize() {
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

      for (const child of node.children) {
        queue.push(child);
      }

      node.position = { x: 600 * (i - (cols / 2 - 0.5)), y: 400 * row };

      i++;
    }
  }
  toFlow() {
    let result = { nodes: [], edges: [] };
    let queue = [JSON.parse(JSON.stringify(this))];

    while (queue.length) {
      let node = queue.shift();
      let id;
      let type = "end";

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
        id = "0";
      }
      delete node.parent;
      delete node.i;

      for (const child of node.children) {
        if (type == "end") type = "middle";
        queue.push({...child, parent: id, i: node.children.indexOf(child) });
      }
      delete node.children;

      result.nodes.push({
        id,
        position: node.position,
        type: "node",
        data: {...node, type}
      });
    }
    
    return result;
  }
}