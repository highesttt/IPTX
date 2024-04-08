export class ProfileDTO {
    name: string;
    username: string;
    password: string;
    url: string;

    constructor(data: any) {
        this.name = data.name;
        this.username = data.username;
        this.password = data.password;
        this.url = data.url;
    }
}