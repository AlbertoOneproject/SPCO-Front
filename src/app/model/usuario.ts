export class Usuario {
    id: string;
    isDeleted: string
    officeId: string;
    staffId: string
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    firsttimeLoginRemaining: boolean;
    nonexpired: boolean;
    nonlocked: boolean;
    nonexpiredCredentials: boolean;
    enabled: boolean;
    lastTimePasswordUpdated: Date;
    passwordNeverExpires: boolean;
    selfServiceUser: boolean

    constructor(usuario) {
        this.id = usuario.id,
        this.isDeleted = usuario.isDeleted,
        this.officeId = usuario.officeId,
        this.staffId = usuario.staffId,
        this.username = usuario.username,
        this.firstname = usuario.firstname,
        this.lastname = usuario.lastname,
        this.password = usuario.password,
        this.email = usuario.email,
        this.firsttimeLoginRemaining = usuario.firsttimeLoginRemaining,
        this.nonexpired = usuario.nonexpired,
        this.nonlocked = usuario.nonlocked,
        this.nonexpiredCredentials = usuario.nonexpiredCredentials,
        this.enabled = usuario.enabled,
        this.lastTimePasswordUpdated = usuario.lastTimePasswordUpdated,
        this.passwordNeverExpires = usuario.passwordNeverExpires,
        this.selfServiceUser = usuario.selfServiceUser
    }
        
}