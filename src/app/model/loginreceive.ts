export class Loginreceive {
    username: string; 
    base64EncodedAuthenticationKey: string; 
    authenticated: boolean; 
    officeId: number; 
    nonlocked: boolean;
    roleId: string;
    permissions: string; 
    name: string;
    description: string;
    disable: boolean;
    userId: string

    contructor(loginreceive) {
        this.username = loginreceive.username,
        this.base64EncodedAuthenticationKey = loginreceive.base64EncodedAuthenticationKey, 
        this.authenticated = loginreceive.authenticated, 
        this.officeId = loginreceive.officeId, 
        this.nonlocked = loginreceive.nonlocked,
        this.roleId = loginreceive.roleId,
        this.permissions = loginreceive.permissions,
        this.name = loginreceive.name,
        this.description = loginreceive.description,
        this.disable = loginreceive.disable,
        this.userId = loginreceive.userId
    }
}