/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 104. 二叉树的最大深度 (Maximum Depth of Binary Tree)
 * 难度: 简单 | 标签: 树、深度优先搜索、广度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/maximum-depth-of-binary-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉树 `root` ，返回其最大深度。
 *
 * 二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [3,9,20,null,null,15,7]
 *   输出：3
 *
 * 示例 2：
 *
 *   输入：root = [1,null,2]
 *   输出：2
 *
 * 提示：
 *   - 树中节点的数量在 `[0, 10^4]` 区间内。
 *   - `-100 <= Node.val <= 100`
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
 * maxDepth
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  // 空节点
  if (root === null) {
      return 0;
  }

  // 左子树的最大深度
  const leftDepth = maxDepth(root.left);

  // 右子树的最大深度
  const rightDepth = maxDepth(root.right);

  // 取左右较大的，再加上当前节点
  return Math.max(leftDepth, rightDepth) + 1;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxDepth(toTree([3, 9, 20, null, null, 15, 7]))); // 期望: 3
