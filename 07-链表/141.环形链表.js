/**
 * LeetCode 热题 100 —— 链表
 *
 * 141. 环形链表 (Linked List Cycle)
 * 难度: 简单 | 标签: 哈希表、链表、双指针、Floyd 判圈算法
 * 链接: https://leetcode.cn/problems/linked-list-cycle/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个链表的头节点 `head` ，判断链表中是否有环。
 *
 * 如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：`pos` 不作为参数进行传递 。仅仅是为了标识链表的实际情况。
 *
 * 如果链表中存在环 ，则返回 `true` 。 否则，返回 `false` 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [3,2,0,-4], pos = 1
 *   输出：true
 *   解释：链表中有一个环，其尾部连接到第二个节点。
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：head = [1,2], pos = 0
 *   输出：true
 *   解释：链表中有一个环，其尾部连接到第一个节点。
 *
 * 示例 3：
 *
 * [图片]
 *
 *   输入：head = [1], pos = -1
 *   输出：false
 *   解释：链表中没有环。
 *
 * 提示：
 *   - 链表中节点的数目范围是 `[0, 10^4]`
 *   - `-10^5 <= Node.val <= 10^5`
 *   - `pos` 为 `-1` 或者链表中的一个 有效索引 。
 *
 * 进阶：你能用 `O(1)`（即，常量）内存解决此问题吗？
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
 * hasCycle
 * @param {ListNode} head
 * @return {boolean}
 */
const hasCycle = function (head) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// const head = toList([3, 2, 0, -4]);
// head.next.next.next.next = head.next; // 尾节点指向第 2 个节点
// console.log(hasCycle(head)); // 期望: true
// console.log(hasCycle(toList([1]))); // 期望: false
