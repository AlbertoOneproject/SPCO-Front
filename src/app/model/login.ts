export class Login {
    cr:            string;
    descripcion:   string;
    idEmpresa:     string;
    idRecinto:     string;
    idUsuario:     string;
    authenticated: boolean;
    bloqueado:     boolean;
    token:         string


    contructor(login) {
        this.idEmpresa	   = login.idEmpresa,
        this.idRecinto     = login.idRecinto,
        this.idUsuario     = login.idUsuario,
        this.authenticated = login.authenticated,
        this.bloqueado     = login.bloqueado,
        this.token         = login.token
    }
        
}