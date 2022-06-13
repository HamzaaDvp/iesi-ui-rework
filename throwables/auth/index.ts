export class AxiosError {
    private message:string;

    constructor(message:string) {
        this.message = message;
    }
}

export class EconnRefusedError extends AxiosError {
    constructor(message: string) {
        super(message);
    }
}
export class InvalidTokenError extends AxiosError {
    constructor(message:string) {
        super(message);
    }
}

export class ExpiredTokenError extends AxiosError {
    constructor(message:string) {
        super(message);
    }
}