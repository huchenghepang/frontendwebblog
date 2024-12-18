import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('chatroom', () => {

    // 显示和隐藏wechatroom
    const isShowWechatRoom = ref(false)
    function showWechatRoom() {
        isShowWechatRoom.value = true
    }

    function hiddenWechatRoom() {
        isShowWechatRoom.value = false
    }

    return { isShowWechatRoom, showWechatRoom, hiddenWechatRoom }
})
