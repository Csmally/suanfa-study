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
 * maxPathSum
 * @param {TreeNode} root
 * @return {number}
 */
const maxPathSum = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxPathSum(toTree([1, 2, 3]))); // 期望: 6
// console.log(maxPathSum(toTree([-10, 9, 20, null, null, 15, 7]))); // 期望: 42
