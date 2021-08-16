export class RolPerm {
    roleId: string;
    permissionId: string

    constructor(rolperm) {
        this.roleId = rolperm.roleId,
        this.permissionId = rolperm.permissionId
    }
        
}