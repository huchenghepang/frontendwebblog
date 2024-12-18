<template>
  <section class="app-main" :style="{ minHeight: appMainMinHeight }">

    <router-view v-slot="{ Component }">

      <keep-alive>
        <transition name="fade-transform" mode="out-in">

          <component :is="Component" v-if="route.meta.keepAlive" />

        </transition>
      </keep-alive>
      <component :is="Component" v-if="!route.meta.keepAlive" />
    </router-view>

  </section>
</template>

<script setup lang="ts" name="AppMain">
  import useCenterStore from '@/stores/modules/center';
  import { useDeviceStore } from '@/stores/modules/device';
  import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

  const route = useRoute()

  const centerStore = useCenterStore();
  const deviceStore = useDeviceStore();
  const { navBarShapeInfo, tagViewShapeInfo } = storeToRefs(centerStore);
  const { screenHeight } = storeToRefs(deviceStore);
  const instance = getCurrentInstance();
  function setInstanceShapeInfo() {
    if (instance && instance.proxy) {
      // 访问组件的根 DOM 元素
      const componentElement = instance.proxy.$el;
      // 例如：调用 store 方法设置元素形状信息
      centerStore.setElementShapeInfo(componentElement, 'appMainShapeInfo');
    }
  }


  const appMainMinHeight = computed(() => {
    let height = "100%";
    if (navBarShapeInfo.value.height && tagViewShapeInfo.value.height && screenHeight.value) {
      height = screenHeight.value - (navBarShapeInfo.value.height + tagViewShapeInfo.value.height) + "px";
    } else if (navBarShapeInfo.value.height && !tagViewShapeInfo.value.height) {
      height = screenHeight.value - navBarShapeInfo.value.height + 'px';
    } else if (!navBarShapeInfo.value.height && tagViewShapeInfo.value.height) {
      height = screenHeight.value - tagViewShapeInfo.value.height + 'px';
    }

    return height

  })

  onMounted(() => {
    setInstanceShapeInfo()
  })

</script>

<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
      padding-top: 84px;
    }
  }
</style>

<style lang="scss">

  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>