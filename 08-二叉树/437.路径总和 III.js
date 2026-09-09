/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 437. 路径总和 III (Path Sum III)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉树
 * 链接: https://leetcode.cn/problems/path-sum-iii/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 路径 的数目。
 *
 * 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 *   输出：3
 *   解释：和等于 8 的路径有 3 条，如图所示。
 *
 * 示例 2：
 *
 *   输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 *   输出：3
 *
 * 提示:
 *   - 二叉树的节点个数的范围是 `[0,1000]`
 *   - `-10^9 <= Node.val <= 10^9` 
 *   - `-1000 <= targetSum <= 1000` 
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
 * pathSum
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
const pathSum = function (root, targetSum) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// console.log(pathSum(toTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)); // 期望: 3
