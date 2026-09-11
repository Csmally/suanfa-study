/**
 * LeetCode 热题 100 —— 链表
 *
 * 2. 两数相加 (Add Two Numbers)
 * 难度: 中等 | 标签: 递归、链表、数学
 * 链接: https://leetcode.cn/problems/add-two-numbers/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 *
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 *
 * 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：l1 = [2,4,3], l2 = [5,6,4]
 *   输出：[7,0,8]
 *   解释：342 + 465 = 807.
 *
 * 示例 2：
 *
 *   输入：l1 = [0], l2 = [0]
 *   输出：[0]
 *
 * 示例 3：
 *
 *   输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 *   输出：[8,9,9,9,0,0,0,1]
 *
 * 提示：
 *   - 每个链表中的节点数在范围 `[1, 100]` 内
 *   - `0 <= Node.val <= 9`
 *   - 题目数据保证列表表示的数字不含前导零
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
 * 解题思路: 模拟竖式加法（逐位相加 + 进位 carry）
 *
 * 关键洞察: 题目把数字"逆序"存储，链表头就是个位。
 *          而竖式加法本来也是从个位开始算的 —— 所以两条链表可以
 *          同时从头往后走，正好就是从低位往高位算，天然对齐，
 *          完全不需要反转链表。
 *
 * 步骤:
 *   1. 建哨兵节点 dummy，cur 指向结果链表的尾巴，carry = 0
 *   2. 只要 l1、l2 还有节点，或者 carry 还没清掉，就继续循环:
 *        x = l1 当前位的值（走到头了当 0），y 同理
 *        sum = x + y + carry
 *        carry = Math.floor(sum / 10)      // 进位，给下一位
 *        cur.next = new ListNode(sum % 10) // 本位，接在结果尾巴后面
 *        l1、l2 各自往后走一格（走到头就一直停在 null）
 *   3. 返回 dummy.next（哨兵节点只是占位，不算结果）
 *
 * 易错点:
 *   - 循环条件必须带上 `carry !== 0`，否则最高位的进位会丢
 *     （比如 99 + 1 = 100，最后要多一位）
 *   - 不要把链表转成数字相加再转回链表：节点数最多 100 位，
 *     远超 JS 的 Number.MAX_SAFE_INTEGER(2^53-1)，会丢精度
 *     （虽然可以用 BigInt，但面试考的就是逐位模拟）
 *
 * 复杂度: 时间 O(max(m, n))，空间 O(max(m, n))（即结果链表的长度）
 */

/**
 * addTwoNumbers
 * 输入: l1 = [2,4,3], l2 = [5,6,4]（342 + 465 = 807）
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode|null}
 */
const addTwoNumbers = function (l1, l2) {
  const dummy = new ListNode(); // 哨兵节点，简化头部处理
  let cur = dummy; // 结果链表的尾巴
  let carry = 0; // 进位

  // 注意第三个条件: 两条链表都走完了，但可能还留着一次进位
  while (l1 !== null || l2 !== null || carry !== 0) {
    const x = l1 === null ? 0 : l1.val; // 走到头就当 0，不影响相加
    const y = l2 === null ? 0 : l2.val;
    const sum = x + y + carry;

    carry = Math.floor(sum / 10); // 进位留给下一位
    cur.next = new ListNode(sum % 10); // 本位接到结果上
    cur = cur.next;

    if (l1 !== null) l1 = l1.next;
    if (l2 !== null) l2 = l2.next;
  }

  return dummy.next; // 跳过哨兵节点
};

// ─── 测试 ───────────────────────────────────────────
// console.log(toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4])))); // 期望: [7, 0, 8]
// console.log(toArray(addTwoNumbers(toList([0]), toList([0])))); // 期望: [0]
// console.log(toArray(addTwoNumbers(toList([9, 9, 9, 9, 9, 9, 9]), toList([9, 9, 9, 9])))); // 期望: [8, 9, 9, 9, 0, 0, 0, 1]
