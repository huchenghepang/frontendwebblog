<template>
    <div>
        <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    width: {
        type: Number,
        default: 800
    },
    height: {
        type: Number,
        default: 600
    },
    ballCount: {
        type: Number,
        default: 10
    }
})

const canvas = ref(null)
const balls = ref([])

const setupCanvas = () => {
    const context = canvas.value.getContext('2d')
    return context
}

const createBalls = () => {
    for (let i = 0; i < props.ballCount; i++) {
        const radius = Math.random() * 20 + 10
        const ball = {
            x: Math.random() * (props.width - radius * 2) + radius,
            y: Math.random() * (props.height - radius * 2) + radius,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            radius,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        }
        balls.value.push(ball)
    }
}

const drawBall = (context, ball) => {
    context.beginPath()
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    context.fillStyle = ball.color
    context.fill()
    context.closePath()
}

const animate = (context) => {
    
    context.clearRect(0, 0, props.width, props.height)
    context.fillRect(0, 0, props.width, props.height);  // 填充背景
    context.fillStyle = 'transparent' // 设置背景颜色
    balls.value.forEach((ball) => {
        // 更新小球的位置
        ball.x += ball.dx
        ball.y += ball.dy

        // 检查边界碰撞并反弹
        if (ball.x + ball.radius > props.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx
        }
        if (ball.y + ball.radius > props.height || ball.y - ball.radius < 0) {
            ball.dy = -ball.dy
        }

        drawBall(context, ball)
    })

    requestAnimationFrame(() => animate(context))
}

onMounted(() => {
    const context = setupCanvas()
    createBalls()
    animate(context)
})
</script>

<style scoped>
canvas {
    display: block;
    margin: 0 auto;
    background: #f0f0f0;
    border: 1px solid #ccc;
}
</style>
