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
 * ───────────────────────────────────────────
 * 解题思路: 分治 —— 取中点当根，左右两半递归
 *
 * 关键转念: 为什么"取中点"就必然平衡？
 *   1. 取中点当根 → 左边一半做左子树，右边一半做右子树
 *   2. 左右两半的节点数最多差 1
 *   3. 节点数最多差 1 → 高度最多差 1 → 严格"高度平衡"直接满足
 *   4. 对左右两半【递归】地这么做，于是每个节点都满足
 *
 *   换句话说: 平衡不是额外要做的事，是"有序"这个前提白送的。
 *
 *   换个角度看更妙 —— 有序数组的中序遍历就是它自己。
 *   所以"取中点建树"其实就是【中序遍历的逆过程】: 把中序序列
 *   还原成树，每次都挑中间那个当根，还原出来自然就是平衡的。
 *
 * 实现:
 *   build(lo, hi) 表示"用 nums[lo..hi] 这一段建一棵子树"
 *     1. lo > hi → 区间为空，返回 null（递归终点）
 *     2. mid = (lo + hi) >> 1，拿 nums[mid] 造根节点
 *     3. 左子树 = build(lo, mid - 1)，右子树 = build(mid + 1, hi)
 *
 * 易错点:
 *   1. 用【下标区间】而不是 nums.slice()。
 *      slice 每次调用都是一次 O(n) 的拷贝，总共会退化成 O(n log n)，
 *      还多吃掉 O(n log n) 的额外内存。传下标则全程只读不拷，O(n)。
 *   2. 递归终点是 lo > hi，不是 lo === hi。
 *      写成 lo === hi 的话，叶子节点的两个孩子（空区间）还要单独处理。
 *   3. mid 取偏左还是偏右【都行】（本题答案不唯一），但选定一个
 *      就一路用同一个约定，别左右摇摆。
 *
 * 复杂度: 时间 O(n)（每个元素恰好被建成一个节点）
 *         空间 O(log n)（递归栈深度 = 树高）
 */

/**
 * sortedArrayToBST
 * 输入: nums = [-10,-3,0,5,9]
 * @param {number[]} nums
 * @return {TreeNode|null}
 */
const sortedArrayToBST = function (nums) {
  // 用 nums[lo..hi] 闭区间这一段的元素，建一棵子树
  const build = (lo, hi) => {
    if (lo > hi) return null; // 区间为空，递归终点

    const mid = (lo + hi) >> 1; // 取中点（偏左）；等价于 Math.floor((lo+hi)/2)
    const node = new TreeNode(nums[mid]);

    node.left = build(lo, mid - 1); // 左半边 → 左子树
    node.right = build(mid + 1, hi); // 右半边 → 右子树

    return node;
  };

  return build(0, nums.length - 1);
};

// ─── 测试 ───────────────────────────────────────────
// // 输出不唯一,任何高度平衡的 BST 均合法;其层序遍历应包含 [-10, -3, 0, 5, 9]
// const bst = sortedArrayToBST([-10, -3, 0, 5, 9]);
// console.log(bst.val); // 期望: 0(以中间元素为根)

// 因为答案不唯一,不能直接比"层序数组等于什么"。
// 正确测法是验证【性质】:
//   ① 中序遍历结果 === 原数组   (说明是合法的 BST)
//   ② 每个节点的左右子树高度差 ≤ 1 (说明是高度平衡的)
//   ③ 节点数 === 数组长度        (说明没有丢节点)
// 下面这段可以直接粘到控制台跑:
//
// const check = (nums) => {
//   const bst = sortedArrayToBST(nums);
//   const inorder = [];
//   let balanced = true;
//   const walk = (n) => {
//     if (!n) return 0;
//     const l = walk(n.left);
//     inorder.push(n.val);
//     const r = walk(n.right);
//     if (Math.abs(l - r) > 1) balanced = false;
//     return Math.max(l, r) + 1;
//   };
//   const height = walk(bst);
//   return {
//     nums,
//     中序等于原数组: JSON.stringify(inorder) === JSON.stringify(nums),
//     高度平衡: balanced,
//     节点数正确: inorder.length === nums.length,
//     树高: height,
//   };
// };
// [[-10, -3, 0, 5, 9], [1, 3], [1], [], [1,2,3,4,5,6,7]].forEach(n => console.log(check(n)));
