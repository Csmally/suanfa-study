/**
 * LeetCode 热题 100 —— 链表
 *
 * 142. 环形链表 II (Linked List Cycle II)
 * 难度: 中等 | 标签: 哈希表、链表、双指针、Floyd 判圈算法
 * 链接: https://leetcode.cn/problems/linked-list-cycle-ii/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个链表的头节点 `head` ，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。
 *
 * 如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 `pos` 是 `-1`，则在该链表中没有环。注意：`pos` 不作为参数进行传递，仅仅是为了标识链表的实际情况。
 *
 * 不允许修改 链表。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [3,2,0,-4], pos = 1
 *   输出：返回索引为 1 的链表节点
 *   解释：链表中有一个环，其尾部连接到第二个节点。
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：head = [1,2], pos = 0
 *   输出：返回索引为 0 的链表节点
 *   解释：链表中有一个环，其尾部连接到第一个节点。
 *
 * 示例 3：
 *
 * [图片]
 *
 *   输入：head = [1], pos = -1
 *   输出：返回 null
 *   解释：链表中没有环。
 *
 * 提示：
 *   - 链表中节点的数目范围在范围 `[0, 10^4]` 内
 *   - `-10^5 <= Node.val <= 10^5`
 *   - `pos` 的值为 `-1` 或者链表中的一个有效索引
 *
 * 进阶：你是否可以使用 `O(1)` 空间解决此题？
 */

// 链表节点定义(与 LeetCode 一致)
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

// 辅助函数: 数组转链表
const toList = (arr) => {
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
};

// 辅助函数: 链表转数组
const toArray = (head) => {
  const res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
};

/**
 * ───────────────────────────────────────────
 * 解题思路: 快慢指针两阶段（Floyd 判圈算法的升级版）
 *
 * 第一阶段（同 141）: 快慢指针在环内相遇
 * 第二阶段: 一个指针回到链表头，另一个留在相遇点，
 *          两个指针同速（都走 1 步）前进 → 相遇点就是环入口
 *
 * 为什么成立（设 头到入口距离 a、入口到相遇点距离 b、相遇点绕回入口距离 c）:
 *   相遇时 slow 走了 a + b
 *   fast 走了 a + b + (b + c)（比 slow 多绕了整整一圈）
 *   fast 速度是 slow 两倍 → 2(a + b) = a + 2b + c → 解得 a = c
 *   "头到入口"的距离 恰好等于 "相遇点绕回入口"的距离，
 *   所以两个同速指针分别从头和相遇点出发，必然同时到达入口
 *
 * 例: 3→2→0→-4 尾接 2（入口是 2）
 *   相遇点: -4（第一阶段走 3 轮）
 *   第二阶段: 指针1 从 3 出发、指针2 从 -4 出发
 *   指针1: 3 → 2        指针2: -4 → 2
 *   在节点 2 相遇 → 返回 2 ✓（a = 1 = c，都只走 1 步）
 *
 * 另一个解法: Set 存访问过的节点，第一个重复的节点就是入口，
 *   简单但 O(n) 空间；本解法 O(1) 空间，且不修改链表（题目要求）
 *
 * 复杂度: 时间 O(n)，空间 O(1)
 */

/**
 * detectCycle
 * 输入: head = [3,2,0,-4]（尾节点接第 2 个节点）
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const detectCycle = function (head) {
  let slow = head;
  let fast = head;

  debugger

  // 第一阶段: 快慢指针找相遇点（无环则 fast 先到 null）
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // 第二阶段: 一个指针回到头，两个指针同速走，相遇点 = 环入口
      let pointerFromHead = head;
      let pointerFromMeet = slow;
      while (pointerFromHead !== pointerFromMeet) {
        pointerFromHead = pointerFromHead.next;
        pointerFromMeet = pointerFromMeet.next;
      }
      return pointerFromHead; // 环入口节点
    }
  }

  return null; // 无环
};

// ─── 测试 ───────────────────────────────────────────
// const head = toList([3, 2, 0, -4]);
// head.next.next.next.next = head.next; // 尾节点指向第 2 个节点
// console.log(detectCycle(head) === head.next); // 期望: true
// console.log(detectCycle(toList([1]))); // 期望: null
