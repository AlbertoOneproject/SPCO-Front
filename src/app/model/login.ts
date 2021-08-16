export class Login {
    usuario: string;
    password: string;
    token?: string;

    contructor(login) {
        this.usuario = login.usuario,
        this.password = login.password,
        this.token = login.token
    }
        
}