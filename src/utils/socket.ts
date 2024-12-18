import io from "socket.io-client";
import {useSocketStore} from "../stores/modules/socket";
import { config } from "@/config/config";


const socketStore = useSocketStore();
// 连接socketio服务器
 export function connectSocket():any{
    const URL = config.socketUrl;
    if(socketStore.socket !==null && socketStore.socket){
        console.error("已经建立了连接，请勿重复连接");
        return
    }else{
        socketStore.socket =io(URL);
        return socketStore.socket;
    }
}


// 断开socket连接
export function disconnectSocket(){
    if(socketStore.socket){
       (<Socket>socketStore.socket).disconnect();
        socketStore.socket = null;
        console.log("断开连接成功");
        
    }
}
