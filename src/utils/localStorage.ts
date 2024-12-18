
/* 储存数据 */

export function setLocalStorage(key: string, value: string) {
    window.localStorage.setItem(key, value);
}

/* 读取数据 */
export function getLocalStorage(key: string) {
    try {
        const data = window.localStorage.getItem(key)
        if (data) {
            return JSON.parse(data)
        }else{
            return undefined
        }
    } catch (error) {
        return {}
    }
}

export function removeLocalStorage(key: string) {
    window.localStorage.removeItem(key)
}