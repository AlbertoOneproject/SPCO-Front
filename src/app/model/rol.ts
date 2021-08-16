export class Rol {
    id: string;
    name: string
    description: string;
    disable: boolean;

    constructor(rol) {
        this.id = rol.id,
        this.name = rol.name,
        this.description = rol.description.
        this.disable = rol.disable
    }
        
}