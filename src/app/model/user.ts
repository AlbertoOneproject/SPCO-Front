export class User {
    idEmpresa:     string;
    idRecinto:     string;
    idUsuario:     string;
    idPerfil:      string;  
    password:      string;
    intentos:      string;
    estatus:       string;
    fecEst:        string;
    userMod:       string;
    progUser:      string


    constructor(user) {
        this.idEmpresa	   = user.idEmpresa,
        this.idRecinto     = user.idRecinto,
        this.idUsuario     = user.idUsuario,
        this.idPerfil      = user.idPerfil,  
        this.password      = user.password, 
        this.intentos      = user.intentos, 
        this.estatus       = user.estatus, 
        this.fecEst        = user.fecEst, 
        this.userMod       = user.userMod, 
        this.progUser      = user.progUser
    }
}