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
}