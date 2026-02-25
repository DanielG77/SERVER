// hooks/useSearchWithDebounce.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useSearchWithDebounce = (initialValue: string = '', delay: number = 15000) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);
    const timerRef = useRef<number | null>(null);

    const setSearch = useCallback((value: string) => {
        setInputValue(value);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
    }, [delay]);

    const searchImmediate = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setDebouncedValue(inputValue);
    }, [inputValue]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        inputValue,
        setSearch,
        debouncedValue,
        searchImmediate,
    };
};