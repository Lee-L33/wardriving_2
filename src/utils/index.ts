import { IOneResponse, IManyResponse } from "../types/base";

export const handleSuccessOneResponse = (
    { code, message, data }:{ code: string, message: string, data: object }
): IOneResponse => {
    return {
        is_error: false,
        code,
        message,
        data,
        error: null
    };
};

export const handleSuccessManyResponse = (
    { code, message, total, data }:{ code: string, message: string, total: number, data: object }
): IManyResponse => {
    return {
        is_error: false,
        code,
        message,
        total,
        data,
        error: null,
    };
};

export const handleErrorOneResponse = (
    { code, message, error }:{ code: string, message: string, error: object }
): IOneResponse => {
    return {
        is_error: true,
        code,
        message, 
        data: null,
        error,
    };
};

export const handleErrorManyResponse = (
    { code, message, error }:{ code: string, message: string, error: object }
): IManyResponse => {
    return {
        is_error: true,
        code,
        message,
        total: 0,
        data: null,
        error,
    };
};