/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 114. 二叉树展开为链表 (Flatten Binary Tree to Linked List)
 * 难度: 中等 | 标签: 栈、树、深度优先搜索、链表、二叉树
 * 链接: https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你二叉树的根结点 `root` ，请你将它展开为一个单链表：
 *   - 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。
 *   - 展开后的单链表应该与二叉树 先序遍历 顺序相同。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [1,2,5,3,4,null,6]
 *   输出：[1,null,2,null,3,null,4,null,5,null,6]
 *
 * 示例 2：
 *
 *   输入：root = []
 *   输出：[]
 *
 * 示例 3：
 *
 *   输入：root = [0]
 *   输出：[0]
 *
 * 提示：
 *   - 树中结点数在范围 `[0, 2000]` 内
 *   - `-100  
 *
 * 进阶：你可以使用原地算法（`O(1)` 额外空间）展开这棵树吗？
 */

// 二叉树节点定义(与 LeetCode 一致)
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

// 辅助函数: 层序遍历数组转二叉树(null 表示空节点)
const toTree = (arr) => {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
};

/**
 * ───────────────────────────────────────────
 * 解题思路: 原地"接头"法（O(1) 空间，正好满足进阶）
 *
 * 关键转念: 先序顺序是 —— 【根 → 左子树全部 → 右子树全部】
 *
 *   于是对任意节点 cur，只要它有左子树:
 *     - 先序里紧跟在 cur 后面的是 左子树的第一个节点（就是 cur.left）
 *     - 左子树【最后】一个被访问的节点，是左子树的【最右节点】
 *     - 左子树全部走完之后，才轮到 右子树全部
 *
 *   所以只要做一件事: 把 cur.right 这一整串，挂到"左子树最右
 *   节点"的 right 上，然后把左子树整体提上来当右子树。
 *
 * 步骤（对每个 cur）:
 *   1. cur.left 为空 → 没有左子树可搬，直接 cur = cur.right
 *   2. cur.left 不空:
 *        a. prev = cur.left，一路 prev = prev.right 走到最右
 *           （它就是先序里左子树最后一个被访问的节点）
 *        b. prev.right = cur.right    ← 把原右子树整串接在它后面
 *        c. cur.right = cur.left      ← 左子树整体提上来
 *        d. cur.left = null           ← 题目要求左指针始终为 null
 *        e. cur = cur.right（继续处理下一个）
 *
 * 易错点:
 *   1. b、c 两步的顺序不能反！必须先把 cur.right 存进 prev.right，
 *      再去覆盖 cur.right。反过来的话原来的右子树就永远找不回来了
 *   2. 找最右节点时看的是 prev.right，不是 prev.left
 *   3. 记得把 cur.left 置 null。题目明确要求展开后左指针始终为
 *      null，漏了的话会形成环，遍历时死循环
 *
 * 为什么还是 O(n): 内层那句"一路向右找最右节点"看着像嵌套循环，
 *   其实它是【均摊】的 —— 内层循环加起来的总步数不超过节点数 n，
 *   所以整体仍是 O(n)。（对随机树、纯左链、扫帚树等各种形状实测
 *   过，内层次数 / 节点数 始终 < 1。）
 *
 * ── 另一个更直白的写法（O(n) 空间） ──
 *   先序遍历把节点按顺序收进一个数组，再顺着数组把 right 指针
 *   重连一遍、left 全部清空。思路一眼就懂，代价是 O(n) 的额外
 *   数组 —— 就不满足进阶了。
 *
 * ── 还有一个很妙的写法（O(h) 递归栈） ──
 *   按【右 → 左 → 根】的倒序先序遍历，边走边维护一个 prev 指针:
 *     dfs(node): dfs(node.right); dfs(node.left);
 *                node.right = prev; node.left = null; prev = node;
 *   因为倒着处理，"上一个处理完的"恰好是先序里排在后面的那个，
 *   直接接上就行。不用数组，但靠的是递归栈，空间 O(h)。
 *
 * 复杂度: 原地接头法 时间 O(n)，空间 O(1)
 */

/**
 * flatten
 * 原地接头法（满足进阶的 O(1) 空间）
 * 输入: root = [1,2,5,3,4,null,6]
 * @param {TreeNode} root
 * @return {void} 原地修改,不返回值
 */
const flatten = function (root) {
  let cur = root;

  while (cur !== null) {
    if (cur.left !== null) {
      // a. 找左子树的最右节点（先序里左子树最后一个被访问的）
      let prev = cur.left;
      while (prev.right !== null) prev = prev.right;

      // b. 把原来的右子树整串挂到它后面（顺序不能和 c 调换！）
      prev.right = cur.right;
      // c. 左子树整体提上来当右子树
      cur.right = cur.left;
      // d. 左指针置空
      cur.left = null;
    }

    // 有左子树的话，cur.right 已经被换成左子树的根了，正好继续
    cur = cur.right;
  }
};

/**
 * flattenByPreorder
 * 直白写法: 先序收集成数组，再顺着数组重连（O(n) 空间）
 * @param {TreeNode} root
 * @return {void}
 */
const flattenByPreorder = function (root) {
  const nodes = [];

  const preorder = (node) => {
    if (node === null) return;
    nodes.push(node); // 根
    preorder(node.left); // 左
    preorder(node.right); // 右
  };
  preorder(root);

  // 顺着数组把 right 串起来，left 全部清空
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].left = null;
    nodes[i].right = i + 1 < nodes.length ? nodes[i + 1] : null;
  }
};

// ─── 测试 ───────────────────────────────────────────
// const root = toTree([1, 2, 5, 3, 4, null, 6]);
// flatten(root);
// // 期望: 展开为右链 1 -> 2 -> 3 -> 4 -> 5 -> 6
// let cur = root;
// while (cur) { console.log(cur.val); cur = cur.right; }

// 这题是"原地修改 + 返回 void"，所以不能直接比返回值。
// 正确测法: 先记下原树的先序序列，然后 flatten，再沿着 right
// 走一遍，验证 ① 值等于先序序列 ② 每个节点的 left 都是 null
//
// const check = (arr, fn) => {
//   const root = toTree(arr);
//   const pre = [];
//   (function go(n) { if (!n) return; pre.push(n.val); go(n.left); go(n.right); })(root);
//
//   fn(root);
//
//   const got = [];
//   let leftOk = true;
//   let cur = root;
//   while (cur) { if (cur.left !== null) leftOk = false; got.push(cur.val); cur = cur.right; }
//
//   return {
//     值等于先序: JSON.stringify(got) === JSON.stringify(pre),
//     left全为null: leftOk,
//     先序: pre,
//     展开后: got,
//   };
// };
// [[1, 2, 5, 3, 4, null, 6], [], [0], [1, 2], [1, null, 2]].forEach(a => console.log(check(a, flatten)));
