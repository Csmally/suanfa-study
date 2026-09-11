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
 * ───────────────────────────────────────────
 * 解题思路: 递归 / 迭代，核心都是"两两配对比较"
 *
 * 关键转念（容易想错的地方）:
 *   题目问"整棵树是否轴对称"。直觉很容易写成
 *   "左子树自己对称 且 右子树自己对称" —— 这是错的。
 *
 *   对称说的是【左右两棵子树互为镜像】，必须拿它们互相比较。
 *   反例: [1,2,2,3,3,4,4]，左子树 (2,3,3) 和右子树 (2,4,4)
 *   各自都是对称的，但整棵树不对称（3 对 4，值就不同）。
 *
 *   所以就变成: 写一个函数，判断【一对】节点 a、b 是否互为镜像。
 *
 * 镜像的三条规则（helper 函数就是这三条）:
 *   1. 两个都空      → 互为镜像（递归终点）
 *   2. 只有一个空    → 不可能镜像
 *   3. 值不同        → 不是镜像
 *   4. 值相同，则继续比孩子，注意是【交叉】比:
 *        a.left  ↔  b.right   （外侧对外侧）
 *        a.right ↔  b.left    （内侧对内侧）
 *
 * 整个入口就是: root 为空 → true；否则比 root.left 和 root.right
 *
 * 易错点:
 *   最容易写成 a.left ↔ b.left、a.right ↔ b.right ——
 *   那是在判断"两棵子树长得一模一样"，即"相同"，不是"镜像"。
 *   镜像是左右翻转过的，所以孩子必须【交叉】着比。
 *
 * 迭代法:
 *   用队列成对存放"待比较的两个节点"，每次取出两个比一次，
 *   再把它们的孩子按镜像顺序成对塞回队列。
 *   本质和递归完全一样，只是把递归栈换成了显式的队列
 *   （进阶要求的两种方法）。
 *
 * 复杂度: 时间 O(n)（每个节点恰好被比较一次）；
 *         递归空间 O(h)（h 为树高），迭代空间 O(n)
 */

/**
 * isSymmetric
 * 输入: root = [1,2,2,3,4,4,3]
 * @param {TreeNode} root
 * @return {boolean}
 */
const isSymmetric = function (root) {
  // 空树视为对称
  if (root === null) return true;

  // 判断 a、b 两棵子树是否互为镜像
  const check = (a, b) => {
    // 规则 1: 两个都空 → 镜像（递归终点）
    if (a === null && b === null) return true;
    // 规则 2: 只有一个空 → 不可能镜像
    if (a === null || b === null) return false;
    // 规则 3: 值不同 → 不是镜像
    if (a.val !== b.val) return false;

    // 规则 4: 孩子【交叉】比 —— 外侧对外侧，内侧对内侧
    return check(a.left, b.right) && check(a.right, b.left);
  };

  return check(root.left, root.right);
};

/**
 * isSymmetricIterative
 * 进阶要求的迭代写法: 队列成对存放待比较的节点
 * @param {TreeNode} root
 * @return {boolean}
 */
const isSymmetricIterative = function (root) {
  if (root === null) return true;

  // 队列里成对存放"待比较的两个节点"
  const queue = [root.left, root.right];
  let head = 0; // 用下标取队头，避免 shift() 每次 O(n) 的搬移

  while (head < queue.length) {
    const a = queue[head++];
    const b = queue[head++];

    if (a === null && b === null) continue; // 都是空，这一对没问题，看下一对
    if (a === null || b === null) return false; // 一空一非空，必然不对称
    if (a.val !== b.val) return false; // 值不同

    // 孩子按镜像顺序成对入队: 外侧对外侧，内侧对内侧
    queue.push(a.left, b.right);
    queue.push(a.right, b.left);
  }

  return true; // 所有配对比完都没问题
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isSymmetric(toTree([1, 2, 2, 3, 4, 4, 3]))); // 期望: true
// console.log(isSymmetric(toTree([1, 2, 2, null, 3, null, 3]))); // 期望: false
// console.log(isSymmetric(toTree([1]))); // 期望: true
// console.log(isSymmetric(toTree([1, 2, 2]))); // 期望: true
// console.log(isSymmetric(toTree([1, 2, 2, 3, 3, 4, 4]))); // 期望: false ← 左右子树各自对称，整体不对称
// console.log(isSymmetricIterative(toTree([1, 2, 2, null, 3, null, 3]))); // 期望: false
