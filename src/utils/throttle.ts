export default function throttle<T extends (...args: any[]) => void>(func: T, ms: number) {
    let isThrottle = false;
    let savedThis: any;
    let savedArgs: any;
    
    function wrapper(this: any, ...args: Parameters<T>) { // `this` 类型为 `any`，参数类型从 `T` 中推导
        if (isThrottle) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        isThrottle = true;
        func.apply(this, args);

        setTimeout(() => {
            isThrottle = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
            }
            savedArgs = savedThis = null;
        }, ms);
    }

    return wrapper as T; 
}