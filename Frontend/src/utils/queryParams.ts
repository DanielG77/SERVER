export const objectToQueryString = (obj: Record<string, any>): string => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            value.forEach((item) => params.append(`${key}[]`, item.toString()));
        } else if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    }
    return params.toString();
};

export const queryStringToObject = (search: string): Record<string, any> => {
    const params = new URLSearchParams(search);
    const obj: Record<string, any> = {};
    for (const [key, value] of params.entries()) {
        if (key.endsWith('[]')) {
            const arrayKey = key.slice(0, -2);
            if (!obj[arrayKey]) obj[arrayKey] = [];
            obj[arrayKey].push(value);
        } else {
            obj[key] = value;
        }
    }
    return obj;
};