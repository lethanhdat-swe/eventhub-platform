export class AppError extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
