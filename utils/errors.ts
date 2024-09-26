// errors.ts
export class AppError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}
 
export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}
