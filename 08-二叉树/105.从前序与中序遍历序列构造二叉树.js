/**
 * LeetCode 热题 100 —— 二叉树
 *
 * 105. 从前序与中序遍历序列构造二叉树 (Construct Binary Tree from Preorder and Inorder Traversal)
 * 难度: 中等 | 标签: 树、数组、哈希表、分治、二叉树
 * 链接: https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的先序遍历， `inorder` 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 *
 * 示例 1:
 *
 * [图片]
 *
 *   输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 *   输出: [3,9,20,null,null,15,7]
 *
 * 示例 2:
 *
 *   输入: preorder = [-1], inorder = [-1]
 *   输出: [-1]
 *
 * 提示:
 *   - `1 <= preorder.length <= 3000`
 *   - `inorder.length == preorder.length`
 *   - `-3000 <= preorder[i], inorder[i] <= 3000`
 *   - `preorder` 和 `inorder` 均 无重复 元素
 *   - `inorder` 均出现在 `preorder`
 *   - `preorder` 保证 为二叉树的前序遍历序列
 *   - `inorder` 保证 为二叉树的中序遍历序列
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
 * 解题思路: 分治 + 哈希表（主推）；另附迭代栈写法
 *
 * 两条铁律（这题的全部地基）:
 *   1. 先序序列的【第一个】元素 = 当前子树的根
 *   2. 在中序序列里找到这个根，它【左边】全是左子树，【右边】全是右子树
 *
 * 于是递归就成立了。设根在中序里的下标为 mid，当前子树的中序
 * 区间是 [inLo, inHi]:
 *
 *     leftSize = mid - inLo          ← 左子树一共有几个节点
 *
 *   那么四个区间一次切出来:
 *     左子树先序 = [preLo + 1,          preLo + leftSize]
 *     右子树先序 = [preLo + leftSize+1, preHi]
 *     左子树中序 = [inLo,  mid - 1]
 *     右子树中序 = [mid+1, inHi]
 *
 *   关键: 先序里"根"永远在区间最左边（preLo）。
 *         而切分靠的是【左子树的节点数】—— 这个数只能从中序里
 *         数出来。这就是为什么题目必须同时给两个序列。
 *
 * 易错点:
 *   1. 【一定要用哈希表存"值 → 中序下标"】。
 *      否则每建一个节点都要在中序里线性扫一遍找根，总复杂度
 *      退化到 O(n²)。题目保证元素无重复，所以值和下标能一一对应。
 *   2. 用【下标区间】而不是 nums.slice()。slice 每次都是 O(n) 拷贝，
 *      同样会退化（而且多吃 O(n log n) 内存）。
 *   3. leftSize 是从【中序】区间算出来的，却用来切【先序】区间，
 *      这两个别搞混。
 *
 * 复杂度: 时间 O(n)（哈希表让"找根"变成 O(1)），空间 O(n)
 *         （哈希表 + 递归栈）
 *
 * ── 迭代写法（栈） ──
 *   先序序列本身就是"DFS 一路走下来"的访问顺序，所以也可以
 *   照着先序"走到哪建到哪"，用一个栈维护"当前这条向下的路径"。
 *
 *   维护 inIdx 指向中序序列走到哪了。对每个新的先序值 val:
 *
 *     a. 栈顶.val !== inorder[inIdx]
 *        → 栈顶这个节点在中序里还没轮到，说明它的左子树还没建完
 *        → 新节点就是栈顶的【左孩子】，压栈
 *
 *     b. 栈顶.val === inorder[inIdx]
 *        → 栈顶的左子树已经建完了（中序里轮到它自己了）
 *        → 一路弹出，直到栈顶的值 ≠ inorder[inIdx]；
 *          最后弹出的那个节点，就是该接【右孩子】的那个
 *        → 新节点挂在它右边，压栈
 *
 *   为什么 b 成立: 中序里"一个节点被访问到"这件事，
 *   恰恰意味着【它的整棵左子树已经全部访问完了】。
 *
 * 复杂度: 迭代法 时间 O(n)（每个节点恰好进栈出栈一次），空间 O(h)
 */

/**
 * buildTree
 * 分治 + 哈希表
 * 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode|null}
 */
const buildTree = function (preorder, inorder) {
  // 值 → 中序下标。有了它，"找根"就是 O(1)
  const indexOf = new Map();
  for (let i = 0; i < inorder.length; i++) {
    indexOf.set(inorder[i], i);
  }

  // 用 preorder[preLo..preHi] 和 inorder[inLo..inHi] 这四段区间建子树
  const build = (preLo, preHi, inLo, inHi) => {
    if (preLo > preHi) return null; // 区间为空，递归终点

    const rootVal = preorder[preLo]; // 先序第一个 = 根
    const root = new TreeNode(rootVal);

    const mid = indexOf.get(rootVal); // 根在中序里的位置
    const leftSize = mid - inLo; // 左子树有多少个节点

    root.left = build(preLo + 1, preLo + leftSize, inLo, mid - 1);
    root.right = build(preLo + leftSize + 1, preHi, mid + 1, inHi);

    return root;
  };

  return build(0, preorder.length - 1, 0, inorder.length - 1);
};

/**
 * buildTreeIterative
 * 迭代写法: 栈 + 中序指针
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode|null}
 */
const buildTreeIterative = function (preorder, inorder) {
  if (preorder.length === 0) return null;

  const root = new TreeNode(preorder[0]);
  const stack = [root]; // 栈里是"当前这条从根往下的路径"
  let inIdx = 0; // 中序序列走到哪了

  for (let i = 1; i < preorder.length; i++) {
    const val = preorder[i];
    let node = stack[stack.length - 1];

    if (node.val !== inorder[inIdx]) {
      // 情况 a: 栈顶的左子树还没建完 → 新节点是它的左孩子
      node.left = new TreeNode(val);
      stack.push(node.left);
    } else {
      // 情况 b: 栈顶的左子树建完了 → 一路弹出，找到该接右孩子的那个
      while (stack.length > 0 && stack[stack.length - 1].val === inorder[inIdx]) {
        node = stack.pop();
        inIdx++;
      }
      node.right = new TreeNode(val);
      stack.push(node.right);
    }
  }

  return root;
};

// ─── 测试 ───────────────────────────────────────────
// const root = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
// console.log(root.val, root.left.val, root.right.val, root.right.left.val, root.right.right.val); // 期望: 3 9 20 15 7

// 这题的验证方式是【往返校验】: 把建出来的树重新走一遍先序和中序,
// 看能不能还原成输入的这两个序列。能还原,就说明建对了。
//
// const preorderOf = (t) => { const o = []; (function go(n){ if(!n) return; o.push(n.val); go(n.left); go(n.right); })(t); return o; };
// const inorderOf  = (t) => { const o = []; (function go(n){ if(!n) return; go(n.left); o.push(n.val); go(n.right); })(t); return o; };
// const check105 = (pre, ino) => {
//   const t = buildTree(pre, ino);
//   return {
//     先序还原: JSON.stringify(preorderOf(t)) === JSON.stringify(pre),
//     中序还原: JSON.stringify(inorderOf(t)) === JSON.stringify(ino),
//   };
// };
// [
//   [[3,9,20,15,7], [9,3,15,20,7]],
//   [[-1], [-1]],
//   [[1,2], [2,1]],
//   [[1,2], [1,2]],
// ].forEach(([p, i]) => console.log(p, i, check105(p, i)));
