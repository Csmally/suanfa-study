/**
 * LeetCode 热题 100 —— 链表
 *
 * 24. 两两交换链表中的节点 (Swap Nodes in Pairs)
 * 难度: 中等 | 标签: 递归、链表
 * 链接: https://leetcode.cn/problems/swap-nodes-in-pairs/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [1,2,3,4]
 *   输出：[2,1,4,3]
 *
 * 示例 2：
 *
 *   输入：head = []
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：head = [1]
 *   输出：[1]
 *
 * 提示：
 *   - 链表中节点的数目在范围 `[0, 100]` 内
 *   - `0 <= Node.val <= 100`
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
 * swapPairs
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const swapPairs = function (head) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(swapPairs(toList([1, 2, 3, 4])))); // 期望: [2, 1, 4, 3]
