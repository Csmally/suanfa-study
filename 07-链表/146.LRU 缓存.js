/**
 * LeetCode 热题 100 —— 链表
 *
 * 146. LRU 缓存 (LRU Cache)
 * 难度: 中等 | 标签: 设计、哈希表、链表、双向链表
 * 链接: https://leetcode.cn/problems/lru-cache/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 请你设计并实现一个满足 LRU (最近最少使用) 缓存 约束的数据结构。
 *
 * 实现 `LRUCache` 类：
 *   - `LRUCache(int capacity)` 以 正整数 作为容量 `capacity` 初始化 LRU 缓存
 *   - `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
 *   - `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 逐出 最久未使用的关键字。
 *
 * 函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。
 *
 * 示例：
 *
 *   输入
 *   ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
 *   [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
 *   输出
 *   [null, null, null, 1, null, -1, null, -1, 3, 4]
 *
 *   解释
 *   LRUCache lRUCache = new LRUCache(2);
 *   lRUCache.put(1, 1); // 缓存是 {1=1}
 *   lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
 *   lRUCache.get(1);    // 返回 1
 *   lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
 *   lRUCache.get(2);    // 返回 -1 (未找到)
 *   lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
 *   lRUCache.get(1);    // 返回 -1 (未找到)
 *   lRUCache.get(3);    // 返回 3
 *   lRUCache.get(4);    // 返回 4
 *
 * 提示：
 *   - `1 <= capacity <= 3000`
 *   - `0 <= key <= 10000`
 *   - `0 <= value <= 10^5`
 *   - 最多调用 `2 * 10^5` 次 `get` 和 `put`
 */

/**
 * @param {number} capacity
 */
class LRUCache {
  constructor(capacity) {
    // TODO: 初始化数据结构
  }

  /**
   * get(key)
   * @param {number} key
   * @return {number}
   */
  get(key) {
    // TODO: 不存在返回 -1
  }

  /**
   * put(key, value)
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // TODO: 超出容量时淘汰最久未使用的 key
  }
}

// ─── 测试 ───────────────────────────────────────────
// const lru = new LRUCache(2);
// lru.put(1, 1);
// lru.put(2, 2);
// console.log(lru.get(1)); // 期望: 1
// lru.put(3, 3);          // 淘汰 key 2
// console.log(lru.get(2)); // 期望: -1
// lru.put(4, 4);          // 淘汰 key 1
// console.log(lru.get(1)); // 期望: -1
// console.log(lru.get(3)); // 期望: 3
// console.log(lru.get(4)); // 期望: 4
