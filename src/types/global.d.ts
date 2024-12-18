interface Socket {
    // 这里列出 `socket` 对象的属性和方法
    emit(event: string, data: any): void;
    on(event: string, callback: (data: any) => void): void;
    // 其他属性和方法
    disconnect():void;
}

// 登录接口
interface Result {
    code?: string | number;
    data?:object | undefined | null;
    message?:string;
    token?:string;
    ErrorMessage?:string
}

// 自定义confirm组件接口
interface CustomConfirm {
    "title"?:string,
    "message"?:string,
    "close"?: Function,
    "cancel"?: Function,
    "confirm"?: Function,
    "isShowClose"?:boolean
}