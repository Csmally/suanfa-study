/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 543. 二叉树的直径 (Diameter of Binary Tree)
 * 难度: 简单 | 标签: 树、深度优先搜索、二叉树、树形 DP
 * 链接: https://leetcode.cn/problems/diameter-of-binary-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一棵二叉树的根节点，返回该树的 直径 。
 *
 * 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 `root` 。
 *
 * 两节点之间路径的 长度 由它们之间边数表示。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [1,2,3,4,5]
 *   输出：3
 *   解释：3 ，取路径 [4,2,1,3] 或 [5,2,1,3] 的长度。
 *
 * 示例 2：
 *
 *   输入：root = [1,2]
 *   输出：1
 *
 * 提示：
 *   - 树中节点数目在范围 `[1, 10^4]` 内
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
 * diameterOfBinaryTree
 * @param {TreeNode} root
 * @return {number}
 */
const diameterOfBinaryTree = function(root) {
  let diameter = 0;

  function depth(node) {
      if (node === null) {
          return 0;
      }

      // 左子树最大深度
      const left = depth(node.left);

      // 右子树最大深度
      const right = depth(node.right);

      // 经过当前节点的路径长度
      diameter = Math.max(diameter, left + right);

      // 返回当前节点的最大深度
      return Math.max(left, right) + 1;
  }

  depth(root);

  return diameter;
};
// ─── 测试 ───────────────────────────────────────────
// console.log(diameterOfBinaryTree(toTree([1, 2, 3, 4, 5]))); // 期望: 3
