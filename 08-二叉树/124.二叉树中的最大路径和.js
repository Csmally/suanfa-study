/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 124. 二叉树中的最大路径和 (Binary Tree Maximum Path Sum)
 * 难度: 困难 | 标签: 树、深度优先搜索、动态规划、二叉树、树形 DP
 * 链接: https://leetcode.cn/problems/binary-tree-maximum-path-sum/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
 *
 * 路径和 是路径中各节点值的总和。
 *
 * 给你一个二叉树的根节点 `root` ，返回其 最大路径和 。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [1,2,3]
 *   输出：6
 *   解释：最优路径是 2 -> 1 -> 3 ，路径和为 2 + 1 + 3 = 6
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [-10,9,20,null,null,15,7]
 *   输出：42
 *   解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42
 *
 * 提示：
 *   - 树中节点数目范围是 `[1, 3 * 10^4]`
 *   - `-1000 <= Node.val <= 1000`
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
 * 解题思路: 树形 DP（后序递归），核心是区分"往上传"和"更新答案"
 *
 * ★ 这是本题唯一的关键，想通它题就通了 ★
 *
 *   对每个节点 node，定义:
 *     gain(node) = 从 node 出发、【一路向下】能得到的最大路径和
 *
 *   注意"一路向下"四个字 —— 从 node 往下走，每步只能选左或右，
 *   不能分叉。因为如果上层节点要连到 node 身上，node 只能有
 *   一个"上游邻居"，所以往下也只能留一条腿。
 *
 *     gain(node) = node.val + max(0, gain(node.left), gain(node.right))
 *
 *   那个 max(0, ...) 是截断: 子树贡献是负数的话，不如不要它
 *   （路径可以走到 node 就停）。
 *
 *   然后，【以 node 为顶点拐弯】的路径（node 是这条路径的最高点）:
 *
 *     node.val + max(0, gain(node.left)) + max(0, gain(node.right))
 *              └────────── 两边都可以要 ──────────┘
 *
 *   全局答案 = 所有节点这个值的最大值。
 *
 * ── 所以一共两件事，千万别搞混 ──
 *     往上传的 gain : 只能选【一边】   (Math.max(left, right))
 *     更新答案候选值 : 【两边都要】     (left + right)
 *
 *   把它们写反是本题最经典的错误。
 *
 * 为什么一趟后序就够:
 *   算 gain(node) 需要先知道两个孩子的 gain —— 这正是【后序】
 *   （左 → 右 → 根）的依赖顺序。
 *
 * 易错点:
 *   1. best 的初值必须是 -Infinity，【不能是 0】。节点值可以是
 *      负数（最低 -1000），如果整棵树全是负数，正确答案是那个
 *      最大的负数；用 0 会给出错误的 0。（题目要求路径至少含
 *      一个节点，不存在"空路径 = 0"这种答案。）
 *   2. 往上传的只能选一边，写成 left + right 就错了
 *   3. 别忘了 Math.max(0, ...) 的截断
 *
 * 复杂度: 时间 O(n)（每个节点访问一次），空间 O(h) 递归栈
 *
 * ── 另附迭代写法（避免递归爆栈） ──
 *   题目节点数最多 3 * 10^4，如果树退化成一条链，递归版有爆栈
 *   风险。迭代版做法:
 *     第一趟: 用栈做一次"根 → 右 → 左"的遍历，得到一个序列
 *     第二趟: 把这个序列【倒着】遍历，就正好是后序
 *             （倒着走时，孩子一定排在父亲前面），
 *             边走边算 gain 并更新答案
 *   不需要递归，空间 O(n)。
 *
 * 复杂度: 迭代法 时间 O(n)，空间 O(n)
 */

/**
 * maxPathSum
 * 后序递归（树形 DP）
 * 输入: root = [-10,9,20,null,null,15,7]
 * @param {TreeNode} root
 * @return {number}
 */
const maxPathSum = function (root) {
  let best = -Infinity; // 【必须是 -Infinity】，不能是 0（节点值可以是负数）

  // 返回: 从 node 出发、一路向下能得到的最大路径和
  const gain = (node) => {
    if (node === null) return 0;

    // 孩子的贡献是负的就不要（截断到 0）
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));

    // 以 node 为"顶点"拐弯的路径 —— 两边都要，用来更新全局答案
    best = Math.max(best, node.val + left + right);

    // 往上传的只能留【一条腿】，否则上游就和 node 接不上了
    return node.val + Math.max(left, right);
  };

  gain(root);
  return best;
};

/**
 * maxPathSumIterative
 * 迭代写法: 先得到后序序列，再倒着算 gain（不爆递归栈）
 * @param {TreeNode} root
 * @return {number}
 */
const maxPathSumIterative = function (root) {
  if (root === null) return 0;

  // 第一趟: "根 → 右 → 左"顺序收集
  const order = [];
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    order.push(node);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }

  // 第二趟: 倒着遍历 = 后序（孩子必然排在父亲前面）
  const gain = new Map();
  let best = -Infinity;

  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];

    const left = node.left !== null ? Math.max(0, gain.get(node.left)) : 0;
    const right = node.right !== null ? Math.max(0, gain.get(node.right)) : 0;

    best = Math.max(best, node.val + left + right);
    gain.set(node, node.val + Math.max(left, right));
  }

  return best;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxPathSum(toTree([1, 2, 3]))); // 期望: 6
// console.log(maxPathSum(toTree([-10, 9, 20, null, null, 15, 7]))); // 期望: 42
// console.log(maxPathSum(toTree([-3]))); // 期望: -3  ← 全负数,考验 best 初值
// console.log(maxPathSum(toTree([-2, -1]))); // 期望: -1
// console.log(maxPathSumIterative(toTree([-3]))); // 期望: -3
