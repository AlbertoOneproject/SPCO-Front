export class Permisos {
    id: string;
    grouping: string
    code: string;
    entity_name: string;
    action_name: string;
    can_maker_checker: boolean

    constructor(permisos) {
        this.id = permisos.id,
        this.grouping = permisos.grouping,
        this.code = permisos.code,
        this.entity_name = permisos.entity_name,
        this.action_name = permisos.action_name,
        this.can_maker_checker = permisos.can_maker_checker
    }
}