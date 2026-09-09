/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 101. 对称二叉树 (Symmetric Tree)
 * 难度: 简单 | 标签: 树、深度优先搜索、广度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/symmetric-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个二叉树的根节点 `root` ， 检查它是否轴对称。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [1,2,2,3,4,4,3]
 *   输出：true
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [1,2,2,null,3,null,3]
 *   输出：false
 *
 * 提示：
 *   - 树中节点数目在范围 `[1, 1000]` 内
 *   - `-100 <= Node.val <= 100`
 *
 * 进阶：你可以运用递归和迭代两种方法解决这个问题吗？
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
 * isSymmetric
 * @param {TreeNode} root
 * @return {boolean}
 */
const isSymmetric = function (root) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isSymmetric(toTree([1, 2, 2, 3, 4, 4, 3]))); // 期望: true
// console.log(isSymmetric(toTree([1, 2, 2, null, 3, null, 3]))); // 期望: false
