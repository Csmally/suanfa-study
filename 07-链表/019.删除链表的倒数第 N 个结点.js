/**
 * LeetCode 热题 100 —— 链表
 *
 * 19. 删除链表的倒数第 N 个结点 (Remove Nth Node From End of List)
 * 难度: 中等 | 标签: 链表、双指针
 * 链接: https://leetcode.cn/problems/remove-nth-node-from-end-of-list/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：head = [1,2,3,4,5], n = 2
 *   输出：[1,2,3,5]
 *
 * 示例 2：
 *
 *   输入：head = [1], n = 1
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：head = [1,2], n = 1
 *   输出：[1]
 *
 * 提示：
 *   - 链表中结点的数目为 `sz`
 *   - `1 <= sz <= 30`
 *   - `0 <= Node.val <= 100`
 *   - `1 <= n <= sz`
 *
 * 进阶：你能尝试使用一趟扫描实现吗？
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
 * 解题思路: 快慢指针（固定间隔 n，一趟扫描）
 *
 * 关键洞察: 链表没法从后往前走，"倒数第 n 个"没法直接定位。
 *          但如果在前面钉一个指针，让它俩永远差 n 步，
 *          那么当快的走到尾巴时，慢的就正好落在倒数第 n 个上。
 *          —— 用"距离"把"倒数"翻译成了"正数"。
 *
 * 步骤:
 *   1. 建哨兵节点 dummy 指向 head，fast = slow = dummy
 *   2. fast 先单独往前走 n + 1 步（多走一步是为了让 slow
 *      最终停在"待删节点的前一个"，好做删除）
 *   3. fast、slow 同时往前走，直到 fast === null
 *      此时 slow 正好在倒数第 n + 1 个节点（待删节点的前驱）
 *   4. slow.next = slow.next.next —— 把待删节点摘掉
 *   5. 返回 dummy.next
 *
 * 为什么必须用哨兵节点: 如果删的是头结点（n === sz），
 * 待删节点没有前驱，slow.next = slow.next.next 就无从下手。
 * 哨兵节点给头结点补了一个"前驱"，这种边界情况就自然消失了。
 *
 * 易错点:
 *   - fast 走的是 n + 1 步而不是 n 步。写 n 步的话 slow 会停在
 *     待删节点自己身上，那就删不掉了
 *   - 返回 dummy.next 而不是 head，否则删头结点时返回的是旧头
 *
 * 为什么可以一趟: "倒数第 n 个"的信息量已经在快慢指针的
 * 固定间隔里了，不需要先遍历一遍求长度。空间 O(1)。
 *
 * 复杂度: 时间 O(sz)（一趟扫描），空间 O(1)
 */

/**
 * removeNthFromEnd
 * 输入: head = [1,2,3,4,5], n = 2
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode|null}
 */
const removeNthFromEnd = function (head, n) {
  const dummy = new ListNode(0, head); // 哨兵节点，给头结点补一个前驱
  let fast = dummy;
  let slow = dummy;

  // fast 先走 n + 1 步，和 slow 拉开固定间隔
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  // 一起走，fast 到 null 时 slow 停在待删节点的前驱上
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next; // 摘掉倒数第 n 个节点

  return dummy.next; // 跳过哨兵节点
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(removeNthFromEnd(toList([1, 2, 3, 4, 5]), 2))); // 期望: [1, 2, 3, 5]
// console.log(toArray(removeNthFromEnd(toList([1]), 1))); // 期望: []
// console.log(toArray(removeNthFromEnd(toList([1, 2]), 1))); // 期望: [1]
// console.log(toArray(removeNthFromEnd(toList([1, 2]), 2))); // 期望: [2]  ← 删头结点，考验哨兵节点
