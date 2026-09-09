/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 108. 将有序数组转换为二叉搜索树 (Convert Sorted Array to Binary Search Tree)
 * 难度: 简单 | 标签: 树、二叉搜索树、数组、分治、二叉树
 * 链接: https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums` ，其中元素已经按 升序 排列，请你将其转换为一棵 平衡 二叉搜索树。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：nums = [-10,-3,0,5,9]
 *   输出：[0,-3,9,-10,null,5]
 *   解释：[0,-10,5,null,-3,null,9] 也将被视为正确答案：
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：nums = [1,3]
 *   输出：[3,1]
 *   解释：[1,null,3] 和 [3,1] 都是高度平衡二叉搜索树。
 *
 * 提示：
 *   - `1 <= nums.length <= 10^4`
 *   - `-10^4 <= nums[i] <= 10^4`
 *   - `nums` 按 严格递增 顺序排列
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
 * sortedArrayToBST
 * @param {number[]} nums
 * @return {TreeNode|null}
 */
const sortedArrayToBST = function (nums) {
  // TODO: 在这里实现你的解法
};

// ─── 测试 ───────────────────────────────────────────
// // 输出不唯一,任何高度平衡的 BST 均合法;其层序遍历应包含 [-10, -3, 0, 5, 9]
// const bst = sortedArrayToBST([-10, -3, 0, 5, 9]);
// console.log(bst.val); // 期望: 0(以中间元素为根)
