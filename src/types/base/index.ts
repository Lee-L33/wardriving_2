export interface IOneResponse {
    is_error: boolean;
    code: string;
    message: string;
    data: object | null;
    error: object | null;
}

export interface IManyResponse {
    is_error: boolean;
    code: string;
    message: string;
    total: number;
    data: object | null;
    error: object | null;
}