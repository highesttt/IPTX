export class UserDTO {
    username: string;
    password: string;
    status: string;
    expiration: string;
    active_connections: string;
    max_connections: string;
    created_at: string;
    server_url: string;

    constructor(data: any) {
        this.username = data.user_info.username;
        this.password = data.user_info.password;
        this.status = data.user_info.status;
        this.expiration = data.user_info.exp_date;
        this.active_connections = data.user_info.active_cons;
        this.max_connections = data.user_info.max_connections;
        this.created_at = data.user_info.created_at;
        this.server_url = data.server_info.server_protocol + "://" + data.server_info.url + ":" + data.server_info.port;
    }
}