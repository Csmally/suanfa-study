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
 * ───────────────────────────────────────────
 * 解题思路: 哈希表 + 双向链表
 *
 * 为什么是这两样凑一块:
 *   题目要求 get / put 都是 O(1)。把需求拆开看就清楚了:
 *     - "O(1) 按 key 找到数据"            → 哈希表
 *     - "O(1) 把任意元素提到最新"          → 需要能在 O(1) 摘掉
 *       链表中间任意一个节点
 *   而"给定节点指针要能 O(1) 删除"，只有【双向】链表做得到:
 *   单链表拿不到前驱，数组挪元素是 O(n)。
 *
 * 结构约定:
 *   - map: key → 链表节点（存节点本身，不是 value）
 *   - 双向链表按"最近使用"排序: head 一侧最新，tail 一侧最旧
 *   - 两个哨兵节点 head / tail: 省掉空链表、插头、删尾的边界判断
 *
 * get(key):
 *   查不到 → -1
 *   查到   → 摘下来重新插到头部（"访问过"就等于"变新"），返回 value
 *
 * put(key, value):
 *   key 已存在 → 改 value，并摘下来插到头部
 *   key 不存在 → 新建节点，插到头部 + 写进 map
 *                若 size 超容量 → 淘汰 tail.prev（最旧的那个），
 *                同时 map.delete(oldest.key)
 *
 * 易错点:
 *   1. 节点里必须存 key！淘汰时手里只有一个"最旧的节点"，
 *      要靠它的 key 才能把 map 里那条记录也删掉
 *   2. 淘汰时【链表和 map 必须一起删】。只摘链表不删 map，
 *      这个 key 之后会 get 到一个已经脱离链表的野节点，行为就错了
 *   3. 双向链表不是随便挑的，理由见上（面试常追问这句）
 *   4. put 更新【已存在】的 key 时，也要把它提到最新，
 *      不能只改 value 就完事
 *
 * 复杂度: get / put 均为 O(1)，空间 O(capacity)
 *
 * 另一条路: JS 的 Map 本身保留插入顺序，靠 map.delete(key) 再
 * map.set(key, v) 重插一遍就能把 key 挪到队尾，十几行就能 AC。
 * 但面试考的是双向链表，用 Map 糊过去一般会被追问，
 * 建议老老实实手写。
 */

// 双向链表节点（注意比普通 ListNode 多了 prev 和 key）
class DListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * @param {number} capacity
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> 链表节点

    // 两个哨兵节点: head.next 是最新的，tail.prev 是最旧的
    this.head = new DListNode(0, 0);
    this.tail = new DListNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /** 把节点从链表中摘下来（不需要知道它在哪，O(1)） */
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /** 把节点插到头部（标记为"最新"） */
  addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node; // 原来的第一个节点，前驱改成 node
    this.head.next = node;
  }

  /** 把节点提到最新位置 */
  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  /**
   * get(key)
   * @param {number} key
   * @return {number}
   */
  get(key) {
    const node = this.map.get(key);
    if (node === undefined) return -1; // 不存在

    this.moveToHead(node); // 被访问过 = 变新
    return node.value;
  }

  /**
   * put(key, value)
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    const node = this.map.get(key);

    if (node !== undefined) {
      // 已存在: 更新值 + 提到最新
      node.value = value;
      this.moveToHead(node);
      return;
    }

    // 不存在: 新建节点，插头部，写进 map
    const newNode = new DListNode(key, value);
    this.map.set(key, newNode);
    this.addToHead(newNode);

    // 超容量: 淘汰最旧的（就是 tail.prev）
    if (this.map.size > this.capacity) {
      const oldest = this.tail.prev;
      this.removeNode(oldest);
      this.map.delete(oldest.key); // 哈希表也要一起删！
    }
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
