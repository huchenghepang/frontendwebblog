import { useUserStore } from "@/stores/modules/user";

// 获取 userStore
const userStore = useUserStore();

/**
 * 权限验证包装函数（柯里化）
 * @param {string} permission - 需要验证的权限标识
 * @returns {Function} 返回一个新的函数，接收回调函数作为参数
 */
export const permissionValidateWrapper = (permission: string) => {
  /**
   * 包装后的函数，接收回调函数
   * @param {Function} callback - 被验证权限的回调函数
   * @returns {Function} 返回一个新的函数，接收回调参数并执行验证
   */
  return (callback: Function) => {
    /**
     * 最终执行的函数，负责执行权限验证和回调调用
     * @param  {...any} args - 传递给回调函数的参数
     */
    return (...args: any[]) => {
      // 检查权限是否存在
      if (!userStore.isHasButtonPermission(permission)) {
        ElMessage({ message: '权限验证失败', type: "warning" })
        return;
      }

      // 使用 bind 确保回调函数的 this 是原始的 callback 的 this
      callback.bind(callback, ...args)(); // 绑定 this 并执行回调函数
    };
  };
};

export const permissionValidateHandler = (permission: string) => {
  if (!userStore.isHasButtonPermission(permission)) {
    ElMessage({ message: '权限验证失败', type: "warning" })
    return false
  } else {
    return true
  }
}