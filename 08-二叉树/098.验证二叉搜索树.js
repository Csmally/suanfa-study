/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 98. 验证二叉搜索树 (Validate Binary Search Tree)
 * 难度: 中等 | 标签: 树、深度优先搜索、二叉搜索树、二叉树
 * 链接: https://leetcode.cn/problems/validate-binary-search-tree/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。
 *
 * 有效 二叉搜索树定义如下：
 *   - 节点的左子树只包含 严格小于 当前节点的数。
 *   - 节点的右子树只包含 严格大于 当前节点的数。
 *   - 所有左子树和右子树自身必须也是二叉搜索树。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：root = [2,1,3]
 *   输出：true
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：root = [5,1,4,null,null,3,6]
 *   输出：false
 *   解释：根节点的值是 5 ，但是右子节点的值是 4 。
 *
 * 提示：
 *   - 树中节点数目范围在`[1, 10^4]` 内
 *   - `-2^31 <= Node.val <= 2^31 - 1`
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
 * 解题思路: 上下界传递 / 中序遍历严格递增，两条路
 *
 * ⚠️ 先说最经典的错误解法（面试最爱考的坑）
 *
 *   凭直觉很容易写成"每个节点只要比自己的孩子满足条件就行":
 *     if (root.left && root.left.val >= root.val) return false;
 *     if (root.right && root.right.val <= root.val) return false;
 *     return isValidBST(root.left) && isValidBST(root.right);
 *
 *   反例: [5,1,6,null,null,4,7]
 *
 *           5
 *          / \
 *         1   6
 *            / \
 *           4   7
 *
 *   朴素写法会判它 true —— 每个父子对都满足。但 4 落在 5 的
 *   【右子树】里，它必须大于 5，实际 4 < 5，所以是非法 BST。
 *
 *   根因: BST 的约束是【整棵子树】级别的，不是"直接父子"级别的。
 *        朴素写法只看了相邻的一层，看不到"我上面所有祖先"。
 *
 * ── 解法一: 上下界（区间）传递 ──
 *
 *   既然约束来自祖先，就把祖先的约束【当成参数往下传】:
 *   每个节点都带着一个合法开区间 (lower, upper)，
 *   值必须落在区间内，否则非法。
 *
 *   check(node, lower, upper)
 *     - 空节点 → true
 *     - node.val 不在 (lower, upper) 内 → false
 *     - 左子树: 上界收紧成 node.val   → check(node.left,  lower,    node.val)
 *     - 右子树: 下界收紧成 node.val   → check(node.right, node.val,  upper)
 *
 *   从根出发的初始区间是 (-∞, +∞)。
 *
 * ── 解法二: 中序遍历必须严格递增 ──
 *
 *   这正是上一题 108 那句话的反面: BST 的中序遍历是严格递增序列。
 *   所以只要中序遍历一遍，看每个值是不是都比前一个大就行。
 *
 *   （顺带一提，108 是"中序 → 建树"，这题是"树 → 看中序"，
 *     两道题其实是同一件事的两个方向。）
 *
 * 易错点:
 *   1. 只比较父子节点（见上，必考坑）
 *   2. 必须是【严格】小于/大于。所以判断写成
 *      `val <= lower || val >= upper`，等号不能少
 *      （反例: [1,1] 应返回 false，写成 < / > 就会漏判）
 *   3. 解法一里左右子树的区间别传反: 左子树动的是【上界】，
 *      右子树动的是【下界】。传反了会漏掉一大类错误
 *   4. 解法二里 prev 的初值要用 -Infinity，不能用 -1 之类的
 *      具体数字 —— 题目 val 可以是负数
 *
 * 复杂度: 两种都是 时间 O(n)，空间 O(h)（h 为树高）
 */

/**
 * isValidBST
 * 解法一: 上下界传递
 * 输入: root = [2,1,3]
 * @param {TreeNode} root
 * @return {boolean}
 */
const isValidBST = function (root) {
  // 判断以 node 为根的子树，其所有值是否都落在开区间 (lower, upper) 内
  const check = (node, lower, upper) => {
    if (node === null) return true; // 空节点合法

    // 必须【严格】落在区间内，等号不算
    if (node.val <= lower || node.val >= upper) return false;

    // 左子树: 上界收紧为当前值；右子树: 下界收紧为当前值
    return check(node.left, lower, node.val) && check(node.right, node.val, upper);
  };

  return check(root, -Infinity, Infinity);
};

/**
 * isValidBSTInorder
 * 解法二: 中序遍历，检查是否严格递增
 * @param {TreeNode} root
 * @return {boolean}
 */
const isValidBSTInorder = function (root) {
  let prev = -Infinity; // 上一个访问过的值（不能用 -1 之类的具体数，val 可以是负的）
  let ok = true;

  const inorder = (node) => {
    if (node === null || !ok) return; // !ok 是剪枝：一旦发现非法就不用继续了

    inorder(node.left);

    if (node.val <= prev) ok = false; // 不是【严格】递增 → 非法
    prev = node.val;

    inorder(node.right);
  };

  inorder(root);
  return ok;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(isValidBST(toTree([2, 1, 3]))); // 期望: true
// console.log(isValidBST(toTree([5, 1, 4, null, null, 3, 6]))); // 期望: false
// console.log(isValidBST(toTree([5, 1, 6, null, null, 4, 7]))); // 期望: false ← 朴素写法会误判成 true
// console.log(isValidBST(toTree([1, 1]))); // 期望: false ← 非严格递增
// console.log(isValidBST(toTree([1]))); // 期望: true
// console.log(isValidBSTInorder(toTree([5, 1, 6, null, null, 4, 7]))); // 期望: false
