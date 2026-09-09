/**
 * LeetCode 热题 100 —— 链表
 *
 * 148. 排序链表 (Sort List)
 * 难度: 中等 | 标签: 链表、双指针、分治、排序、归并排序
 * 链接: https://leetcode.cn/problems/sort-list/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你链表的头结点 `head` ，请将其按 升序 排列并返回 排序后的链表 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [4,2,1,3]
 *   输出：[1,2,3,4]
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：head = [-1,5,3,4,0]
 *   输出：[-1,0,3,4,5]
 *
 * 示例 3：
 *
 *   输入：head = []
 *   输出：[]
 *
 * 提示：
 *   - 链表中节点的数目在范围 `[0, 5 * 10^4]` 内
 *   - `-10^5 <= Node.val <= 10^5`
 *
 * 进阶：你可以在 `O(n log n)` 时间复杂度和常数级空间复杂度下，对链表进行排序吗？
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
 * sortList
 * @param {ListNode} head
 * @return {ListNode|null}
 */
const sortList = function (head) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(sortList(toList([4, 2, 1, 3])))); // 期望: [1, 2, 3, 4]
