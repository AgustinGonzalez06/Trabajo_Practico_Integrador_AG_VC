export class User {
    constructor(name, productos) {
        this.id = crypto.randomUUID(); // ID simple
        this.name = name;
        this.productos = productos;
    }
}