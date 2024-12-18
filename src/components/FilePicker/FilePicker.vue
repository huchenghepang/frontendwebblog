<template>
    <div
        ref="draggable"
        class="file-picker"
        :style="{ top: position.y + 'px', left: position.x + 'px' }"
        @mousedown="startDragging"
    >
        <!-- 点击区域，用于触发文件选择 -->
        <button
            class="btn-contaniner"
            @click="triggerFilePicker"
        >
            {{ text }}
        </button>
    </div>
</template>

<script lang="ts">
import getElementInfo from "@/utils/getElementInfo";
import type { ElementInfo } from "@/utils/getElementInfo";
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
export default defineComponent({
    name: "FloatingFilePicker",
    props: {
        acceptedTypes: {
            type: [String, Array], // 支持字符串和数组格式
            default: "*/*", // 默认接受所有文件类型
        },
        text: {
            type: String,
            default: "选择文件"
        },
        offsetXY: {
            type: Object,
            default: () => ({ x: 0, y: 0 })
        }
    },
    emits: ["fileSelected"],
    setup(props, { emit }) {
        // 组件的位置
        const position = reactive({ x: window.innerWidth - 200, y: window.innerHeight / 2 - 50 });
        const offset = reactive({ x: 0, y: 0 });
        const isDragging = ref(false);
        const draggable = ref<HTMLElement | null>(null);
        let draggableInfo = ref<ElementInfo | null>(null)


        // 计算接受的文件类型，将数组转换为逗号分隔的字符串
        const acceptedFileTypes = computed(() => {
            return Array.isArray(props.acceptedTypes) ? props.acceptedTypes.join(",") : props.acceptedTypes;
        });

        // 触发文件选择器
        const triggerFilePicker = () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = acceptedFileTypes.value;
            input.onchange = (event: Event) => {
                const target = event.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                    console.log();

                    emit("fileSelected", target.files);
                }
            };
            input.click();
        };

        // 开始拖动
        const startDragging = (event: MouseEvent) => {
            isDragging.value = true;
            offset.x = event.clientX - position.x;
            offset.y = event.clientY - position.y;
            document.addEventListener("mousemove", onDrag);
            document.addEventListener("mouseup", stopDragging);


        };

        // 拖动中
        const onDrag = (event: MouseEvent) => {
            if (isDragging.value) {
                if(draggableInfo.value){
                    // 调整位置 但是不能超过视口的位置
                    position.x = Math.min(Math.max(0, event.clientX - offset.x), window.innerWidth - draggableInfo.value.clientWidth - 20);
                    position.y = Math.min(Math.max(0, event.clientY - offset.y), window.innerHeight - draggableInfo.value.clientHeight / 2);
                }
                
            }
        };

        // 停止拖动
        const stopDragging = () => {
            isDragging.value = false;
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", stopDragging);
        };

        onMounted(() => {
            // 确保元素在mounted时初始化位置
            if (draggable.value) {
                draggableInfo.value = getElementInfo(draggable.value);
                position.x = window.innerWidth - draggableInfo.value.clientWidth - 20 - props.offsetXY.x;
                position.y = window.innerHeight / 2 - draggableInfo.value.clientHeight / 2 - props.offsetXY.y;
            }
        });

        return { position, startDragging, triggerFilePicker, draggable, draggableInfo };
    },
});
</script>

<style scoped lang="scss">
    .file-picker {
        position: fixed;
        width: 100px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(0deg, #f83600 0%, #f9d423 100%);
        color: rgb(238, 181, 181);
        border-radius: 8px;
        cursor: pointer;
        z-index: 1000;
        user-select: none;
        border: #a981bb 1px solid;
        backdrop-filter: blur(5px);
        box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

        .btn-contaniner {
            background-image: linear-gradient(0deg, #3b41c5 0%, #a981bb 49%, #ffc8a9 100%);
            color: #fafafa;

            &:hover {
                cursor: pointer;
                background-color: #cc175d !important;
            }
        }
    }
</style>
