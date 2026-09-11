/**
 * LeetCode 热题 100 —— 链表
 *
 * 160. 相交链表 (Intersection of Two Linked Lists)
 * 难度: 简单 | 标签: 哈希表、链表、双指针
 * 链接: https://leetcode.cn/problems/intersection-of-two-linked-lists/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。
 *
 * 图示两个链表在节点 `c1` 开始相交：
 *
 * [图片]
 *
 * 题目数据 保证 整个链式结构中不存在环。
 *
 * 注意，函数返回结果后，链表必须 保持其原始结构 。
 *
 * 自定义评测：
 *
 * 评测系统 的输入如下（你设计的程序 不适用 此输入）：
 *   - `intersectVal` - 相交的起始节点的值。如果不存在相交节点，这一值为 `0`
 *   - `listA` - 第一个链表
 *   - `listB` - 第二个链表
 *   - `skipA` - 在 `listA` 中（从头节点开始）跳到交叉节点的节点数
 *   - `skipB` - 在 `listB` 中（从头节点开始）跳到交叉节点的节点数
 *
 * 评测系统将根据这些输入创建链式数据结构，并将两个头节点 `headA` 和 `headB` 传递给你的程序。如果程序能够正确返回相交节点，那么你的解决方案将被 视作正确答案 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
 *   输出：Intersected at '8'
 *   解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
 *   从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
 *   在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
 *   — 请注意相交节点的值不为 1，因为在链表 A 和链表 B 之中值为 1 的节点 (A 中第二个节点和 B 中第三个节点) 是不同的节点。换句话说，它们在内存中指向两个不同的位置，而链表 A 和链表 B 中值为 8 的节点 (A 中第三个节点，B 中第四个节点) 在内存中指向相同的位置。
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
 *   输出：Intersected at '2'
 *   解释：相交节点的值为 2 （注意，如果两个链表相交则不能为 0）。
 *   从各自的表头开始算起，链表 A 为 [1,9,1,2,4]，链表 B 为 [3,2,4]。
 *   在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
 *
 * 示例 3：
 *
 * [图片]
 *
 *   输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
 *   输出：No intersection
 *   解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。
 *   由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
 *   这两个链表不相交，因此返回 null 。
 *
 * 提示：
 *   - `listA` 中节点数目为 `m`
 *   - `listB` 中节点数目为 `n`
 *   - `1 <= m, n <= 3 * 10^4`
 *   - `1 <= Node.val <= 10^5`
 *   - `0 <= skipA <= m`
 *   - `0 <= skipB <= n`
 *   - 如果 `listA` 和 `listB` 没有交点，`intersectVal` 为 `0`
 *   - 如果 `listA` 和 `listB` 有交点，`intersectVal == listA[skipA] == listB[skipB]`
 *
 * 进阶：你能否设计一个时间复杂度 `O(m + n)` 、仅用 `O(1)` 内存的解决方案？
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
 * getIntersectionNode
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode|null}
 */
const getIntersectionNode = function (headA, headB) {
  // TODO: 在这里实现你的解法
  let curNodeA = headA;
  while (curNodeA) {
    let curNodeB = headB;
    while (curNodeB) {
      if (curNodeA === curNodeB) {
        return curNodeA;
      } else {
        curNodeB = curNodeB.next;
      }
    }
    curNodeA = curNodeA.next;
  }
  return null
};

/**
 * ───────────────────────────────────────────
 * 解题思路: 双指针（"你走完我的路，我走完你的路"）—— O(m+n) 进阶解
 *
 * 设 A 独有段长度 a、B 独有段长度 b、公共段长度 c
 *   - pointerA 从 A 出发，走完 A 后接到 B 的头上继续走
 *   - pointerB 从 B 出发，走完 B 后接到 A 的头上继续走
 * 有交点时:
 *   pointerA 走 a + c + b 步，pointerB 走 b + c + a 步，
 *   总路程相等 → 两指针同时到达交点 → 循环在 pointerA === pointerB 时退出
 * 无交点时:
 *   两指针都走 a + b 步 → 同时走到 null → 返回 null
 *
 * 关键点: 比较的是节点引用（===）而不是节点的值（.val），
 *        题目特意强调"值相同的两个节点可能不是同一个节点"
 *        （暴力双循环枚举也能做，但 O(m*n) 会超时；哈希 Set 也可以，O(m+n) 但要 O(m) 空间）
 *
 * 复杂度: 时间 O(m+n)，空间 O(1)
 */

/**
 * getIntersectionNodeTwoPointers
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode|null}
 */
const getIntersectionNodeTwoPointers = function (headA, headB) {
  let pointerA = headA;
  let pointerB = headB;


  // 两指针各自走完自己的链表后，接到对方链表头上继续走，
  // 总路程相同 → 要么在交点相遇，要么同时走到 null
  while (pointerA !== pointerB) {
    pointerA = pointerA === null ? headB : pointerA.next;
    pointerB = pointerB === null ? headA : pointerB.next;
  }

  return pointerA; // 交点节点 或 null（不相交）
};

// 链表 A：  A1 → A2 → C1 → C2
// 链表 B：  B1 → B2 → B3 → C1 → C2

// 链表 A：  A1 → A2 → C1 → C2 → B1 → B2 → B3 → C1 → C2
// 链表 B：  B1 → B2 → B3 → C1 → C2 → A1 → A2 → C1 → C2
// ─── 测试 ───────────────────────────────────────────
// const common = toList([8, 4, 5]);
// const a = toList([4, 1]);
// a.next.next = common; // 4 -> 1 -> 8 -> 4 -> 5
// const b = toList([5, 6, 1]);
// b.next.next.next = common; // 5 -> 6 -> 1 -> 8 -> 4 -> 5
// console.log(getIntersectionNode(a, b) === common); // 期望: true
