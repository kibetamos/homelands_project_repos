import { useRef, useEffect } from 'react';

export const FirstRender = () => {
    const firstRender = useRef(true);

    useEffect(() => {
        firstRender.current = false;
    }, []);

    return firstRender.current;
}