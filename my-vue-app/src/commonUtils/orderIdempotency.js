/**
 * 下单幂等状态在 sessionStorage 中使用的键前缀。
 */
const ORDER_IDEMPOTENCY_STORAGE_PREFIX = 'createOrderIdempotency:';

/**
 * 为当前用户获取或创建下单幂等键。
 *
 * @param {string} userId 当前登录用户ID。
 * @param {object} orderPayload 本次下单请求体。
 * @param {Storage} storage 浏览器会话存储。
 * @param {() => string} [keyFactory] 可选的幂等键生成函数，默认生成标准UUID。
 * @returns {string} 当前订单请求应使用的幂等键。
 */
export const getOrCreateOrderIdempotencyKey = (userId, orderPayload, storage, keyFactory) => {
  const storageKey = `${ORDER_IDEMPOTENCY_STORAGE_PREFIX}${userId}`;
  const requestPayload = JSON.stringify(orderPayload);
  const storedValue = storage.getItem(storageKey);

  if (storedValue) {
    try {
      const storedState = JSON.parse(storedValue);
      if (
        storedState.requestPayload === requestPayload
        && typeof storedState.idempotencyKey === 'string'
        && storedState.idempotencyKey.trim()
      ) {
        return storedState.idempotencyKey;
      }
    } catch {
      // 历史数据损坏时忽略旧值，后续使用新生成的幂等键覆盖。
    }
  }

  // 浏览器原生UUID能够为每一次新的订单内容生成足够唯一的业务幂等键。
  const idempotencyKey = keyFactory ? keyFactory() : globalThis.crypto.randomUUID();
  storage.setItem(storageKey, JSON.stringify({
    requestPayload,
    idempotencyKey,
  }));
  return idempotencyKey;
};

/**
 * 订单创建成功后清除当前用户保存的幂等状态。
 *
 * @param {string} userId 当前登录用户ID。
 * @param {Storage} storage 浏览器会话存储。
 */
export const clearOrderIdempotencyState = (userId, storage) => {
  storage.removeItem(`${ORDER_IDEMPOTENCY_STORAGE_PREFIX}${userId}`);
};

/**
 * 构建符合订单服务接口约定的 Axios 请求配置。
 *
 * @param {string} idempotencyKey 当前订单请求的幂等键。
 * @returns {{headers: {'Idempotency-Key': string}}} Axios 请求配置。
 */
export const buildOrderRequestConfig = (idempotencyKey) => ({
  headers: {
    'Idempotency-Key': idempotencyKey,
  },
});
