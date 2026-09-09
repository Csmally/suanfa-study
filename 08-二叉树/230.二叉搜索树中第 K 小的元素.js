/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 230. 二叉搜索树中第 K 小的元素 (Kth Smallest Element in a BST)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉搜索树、二叉树
 * 链接: https://leetcode.cn/problems/kth-smallest-element-in-a-bst/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k` 小的元素（`k` 从 1 开始计数）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [3,1,4,null,2], k = 1
 *   输出：1
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [5,3,6,2,4,null,null,1], k = 3
 *   输出：3
 *
 * 提示：
 *   - 树中的节点数为 `n` 。
 *   - `1 <= k <= n <= 10^4`
 *   - `0 <= Node.val <= 10^4`
 *
 * 进阶：如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 `k` 小的值，你将如何优化算法？
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
 * kthSmallest
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
const kthSmallest = function (root, k) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(kthSmallest(toTree([3, 1, 4, null, 2]), 1)); // 期望: 1
