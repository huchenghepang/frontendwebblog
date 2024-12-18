<template>
    <div class="contaniner">
        <div class="chatroom-login-container">
            <h2 class="title">
                虚拟角色选择
            </h2>
            <div class="sky-city">
                <div class="userinfo">
                    <div class="username-signature">
                        <div class="user-name">
                            <input
                                v-if="!isShowWechatRoom"
                                v-model.trim="userInfo.username"
                                tabindex="1"
                                type="text"
                                placeholder="请输入用户名"
                                maxlength="10"
                            >
                            <span v-else>{{ userInfo.username }}</span>
                        </div>
                        <br>
                        <div class="signature">
                            <input
                                v-if="!isShowWechatRoom"
                                v-model.trim="userInfo.signature"
                                tabindex="2"
                                type="text"
                                placeholder="请输入你的个性签名"
                                maxlength="20"
                            >
                            <span v-else>{{ userInfo.signature }}</span>
                        </div>
                        <button
                            class="loginout"
                            @click="loginOut"
                        >
                            退出登录
                        </button>
                    </div>
                    <div class="vir-box" />
                    <!-- 请选择你的头像 -->
                    <h4>请选择你的头像：</h4>
                    <div class="avator-box">
                        <div
                            v-for="index in number"
                            :key="index"
                            class="avator"
                        >
                            <img
                                :class="{ active: currentIndex === index ? 1 : 0 }"
                                :src="`./avator/${index}.png`"
                                alt=""
                                :data-img-url="`./avator/${index}.png`"
                                :tabindex="3 + index"
                                @click="confimPic(index, $event)"
                            >
                        </div>
                        <div class="btn-box">
                            <button
                                v-if="!isShowWechatRoom"
                                tabindex="13"
                                class="confirm-enter-chat"
                                @click="confirmEnterChatRoom"
                            >
                                进入聊天室
                            </button>
                            <button
                                v-else
                                tabindex="14"
                                class="confirm-leave-chat"
                                @click="confirmLeaveChatRoom"
                            >
                                离开聊天室
                            </button>
                            <button
                                v-if="isShowWechatRoom"
                                tabindex="15"
                                class="confirm-leave-chat close-room"
                                @click="confirmCloseChatRoom"
                            >
                                关闭聊天室
                            </button>
                            <button
                                v-if="isShowWechatRoom && !isOnline"
                                tabindex="16"
                                class="restart-confirm-enter-chat confirm-leave-chat"
                                @click="restartChatRoom"
                            >
                                重新进入聊天室
                            </button>
                        </div>

                        <div :class="{ 'avator-mask': isShowWechatRoom }" />
                    </div>
                </div>
            </div>
        </div>
        <!-- 聊天室 -->
        <WeChat
            v-if="isShowWechatRoom"
            class="weChat"
            :messages="messages"
            :is-online="isOnline"
            :user-info="userInfo"
            :socket="socket"
            :is-show-wechat-room="isShowWechatRoom"
            :users-info-list="usersInfoList"
        />
    </div>
</template>

<script lang="ts" name="ChatroomView" setup>
import WeChat from '@/components/WeChat/WeChat.vue'
import { disconnectSocket, connectSocket } from '@/utils/socket'
import { getCurrentInstance, ref, onMounted, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import emitter from '@/utils/mitt'
const userStore = useUserStore()
const messages = ref<any[]>([])
const isOnline = ref(false)
const isShowWechatRoom = ref(false)

onMounted(() => {
    // 获取用户信息
    userStore.getUserInfo()
})

interface UserInfo {
    username: string
    avator: string
    signature: string
}
const userInfo = ref<UserInfo>({
    username: '',
    avator: '',
    signature: ''
})
const usersInfoList = ref<[UserInfo]>()
let socket: Socket

const { proxy } = getCurrentInstance()!

const currentIndex = ref<null | number>(null)

function confimPic(index: number, event: Event) {
    currentIndex.value = index
    // console.log(event.target.dataset["imgUrl"])
    const target = event.target as HTMLElement
    if (target !== null && target) {
        userInfo.value.avator = target.dataset['imgUrl'] as string
    }
}

function clickConfirm(config: CustomConfirm) {
    return (proxy as any).$customConfirm(config)
}
function confirmEnterChatRoom() {
    // debugger;
    if (isShowWechatRoom.value && isOnline.value) {
        ;(proxy! as any).$message({ text: '已经在聊天室了', type: 'error' })
        return false
    }
    if (userInfo.value.avator !== '' && userInfo.value.username !== '' && userInfo.value.signature !== '') {
        isShowWechatRoom.value = true

        socket = connectSocket()
        if (!socket) return
        socket.on('connect', () => {
            ;(proxy! as any).$message({ text: '正在进行通讯...', type: 'warn' })
            // 向服务器发送消息
            socket.emit('enterchatroom', userInfo.value)
            isOnline.value = true
        })
        socket.on('broadcast', (data) => {
            messages.value.push(data)
            if (data.type == 1 || data.type == 2) {
                usersInfoList.value = data.data.map((userInfo: any) => {
                    return userInfo
                })
            }
        })
        socket.on('error', (err) => {
            isOnline.value = false
            ;(proxy! as any).$message({ text: '断开了与服务器的websocket连接' + err.message.toString, type: 'error' })
        })
        socket.on('disconnect', () => {
            isOnline.value = false
            ;(proxy! as any).$message({ text: '断开了与服务器的websocket连接', type: 'error' })
        })
    } else {
        ;(proxy! as any).$message({ text: '请完成您的信息', type: 'warn' })
        return true
    }
}
function abortWebsocket() {
    isShowWechatRoom.value = false
    userInfo.value.username = ''
    userInfo.value.avator = ''
    userInfo.value.signature = ''
    messages.value = []
    currentIndex.value = null
    // 断开与服务器的websocket连接
    disconnectSocket()
}
function confirmLeaveChatRoom() {
    clickConfirm({ title: '离开聊天室提醒', message: '确定要离开聊天室吗', confirm: disconnectSocket })
}
function confirmCloseChatRoom() {
    clickConfirm({ title: '关闭聊天室提醒', message: '确定要关闭聊天室吗', confirm: abortWebsocket })
}

function restartChatRoom() {
    disconnectSocket()
    confirmEnterChatRoom()
}
// 退出登录
async function loginOut() {
    // 这里因为是JWT 无状态 没有在后端有黑名单机制 所以前端删除就行了
    userStore.logout()
}

// 定义一个函数来更新窗口宽度
const updateWidth = () => {
    windowWidth.value = window.innerWidth
}

// 在组件挂载时添加事件监听器
onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

// 在组件卸载时移除事件监听器
onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})
const windowWidth = ref(window.innerWidth)
// 判断是否为桌面设备
const isDesktop = computed(() => {
    return windowWidth.value >= 1024 // 1024px 以上一般认为是桌面设备
})

const number = computed(() => (isDesktop.value ? 10 : 9))

onMounted(()=>{
    emitter.on("leave",confirmLeaveChatRoom);
    emitter.on("close",confirmCloseChatRoom);
    emitter.on("reEnter",restartChatRoom);

})

</script>

<style scoped lang="scss">
button {
    cursor: pointer;
}
.chatroom-login-container {
    display: inline-block;
    text-align: center;
    padding: 0 10px;
    position: relative;
    // 退出登录按钮
    .loginout {
        position: absolute;
        top: 0px;
        left: 20px;
        width: 80px;
        height: 30px;
        background-color: #f44336;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }
    .loginout:hover {
        background-color: #f36b68;
    }
    .title {
        color: darkkhaki;
    }

    .user-name {
        position: relative;
        display: inline-block;
        margin-left: 80px;
        margin-bottom: 10px;
    }

    .user-name::before {
        position: absolute;
        display: block;
        width: 80px;
        height: 30px;
        font-size: 16px;
        content: '昵称:';
        color: #000;
        left: -64px;
    }

    .signature {
        position: relative;
        display: inline-block;
        margin-left: 80px;
    }

    .signature::before {
        position: absolute;
        display: block;
        width: 80px;
        height: 30px;
        font-size: 16px;
        content: '个性签名:';
        color: #000;
        left: -80px;
    }
    .avator-box {
        position: relative;
        width: 560px;
        height: 225px;
        /* height: 900px; */
        background-color: rgb(232, 235, 231);
        display: grid;
        grid-template-columns: repeat(5, minmax(100px, 1fr));
        grid-template-rows: 110px;
        grid-gap: 6px;
        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.4);

        .avator {
            img {
                width: 100px;
                height: 100px;
                object-fit: cover;
                border-radius: 2px;
            }

            img:hover {
                border: 2px solid #ff5e5e;
                transform: translateY(2px);
            }

            .active {
                border: 2px solid #ff5e5e;
            }
        }

        .avator-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 560px;
            height: 225px;
            background-color: rgba(0, 0, 0, 0.4);
        }
    }

    .btn-box {
        .confirm-enter-chat {
            left: 260px;
            bottom: -55px;
            position: absolute;
            font-size: 18px;
            background-color: #cb1244;
            text-align: center;
            align-content: middle;
            line-height: 50px;
            transform: translateX(-50%);
            border-radius: 30px;
        }

        .confirm-enter-chat:hover {
            border: 2px solid #ccc;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .confirm-leave-chat {
            left: 260px;
            bottom: -55px;
            position: absolute;
            font-size: 18px;
            background-color: #cb1244;
            text-align: center;
            align-content: middle;
            line-height: 50px;
            transform: translateX(-50%);
            border-radius: 30px;
            @media screen and (max-width:768px) {
                display: none;
            }
        }

        .close-room {
            bottom: -110px;
        }

        .confirm-leave-chat:hover {
            border: 2px solid #ccc;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .restart-confirm-enter-chat {
            bottom: -165px;
        }

        .restart-confirm-enter-chat {
            border: 2px solid #ccc;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        @media screen and (max-width:768px) {
            // position: fixed;
            // background-color: #cb1244;
            // width: 200px;
            // height: 200px;
        }
    }
}

@media screen and (max-width: 768px) {
    .contaniner {
        position: relative;
        height: calc(100vh - 35px);
        .chatroom-login-container {
            width: 100vw;
            height: calc(100vh - 35px);
            padding: 0;
        }

        .avator-box {
            position: relative;
            width: 99vw !important;
            height: 50vh !important;
            /* height: 900px; */
            background-color: rgb(232, 235, 231);
            display: grid;
            grid-template-columns: repeat(3, minmax(33%, 1fr)) !important;
            grid-template-rows: auto;
            grid-gap: 1px !important;
            box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.4);
            .avator {
                img {
                    object-fit: cover;
                    border-radius: 2px;
                }
                img:hover {
                    border: 2px solid #ff5e5e;
                    transform: translateY(2px);
                }

                .active {
                    border: 2px solid #ff5e5e;
                }
            }
            .avator-mask {
                width: 100vw !important;
                position: absolute;
                top: 0;
                left: 0;
                width: 560px;
                height: 225px;
                background-color: rgba(0, 0, 0, 0.4);
            }
        }

        .weChat {
            position: fixed !important;
            top: 0;
            left: 0;
            margin: 0 !important;
            width: 100vw !important;
            height: calc(100vh - $header-height) !important;
            top: $header-height;
            &:deep(.wechat-room) {
                @media screen and (max-width: 768px) {
                    width: 100%;
                    margin: 0 !important;
                    // transform: scale(0.8);
                    transform-origin: 0 0;

                    .wechat-room-head {
                        .user-info-simple {
                            margin: 0;
                        }
                    }

                    .out-container-content {

                        .wechat-room-content {
                            height: 100%;
                            // transform: scaleY(0.9)
                        }
                    }
                }
            }
        }
    }
}
</style>
