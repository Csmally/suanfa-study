/**
 * LeetCode 热题 100 —— 二分查找
 *
 * 74. 搜索二维矩阵 (Search a 2D Matrix)
 * 难度: 中等 | 标签: 数组、二分查找、矩阵
 * 链接: https://leetcode.cn/problems/search-a-2d-matrix/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个满足下述两条属性的 `m x n` 整数矩阵：
 *   - 每行中的整数从左到右按非严格递增顺序排列。
 *   - 每行的第一个整数大于前一行的最后一个整数。
 *
 * 给你一个整数 `target` ，如果 `target` 在矩阵中，返回 `true` ；否则，返回 `false` 。
 *
 * 你必须编写一个时间复杂度为 `O(log(m * n))` 的解决方案。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
 *   输出：true
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
 *   输出：false
 *
 * 提示：
 *   - `m == matrix.length`
 *   - `n == matrix[i].length`
 *   - `1 <= m, n <= 100`
 *   - `-10^4 <= matrix[i][j], target <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 把矩阵"当成"一个排好序的一维数组，直接二分
 *
 * ★ 关键转念: 题目给的两条性质，合起来说了什么？★
 *
 *   性质一: 每行从左到右递增
 *   性质二: 每行第一个 > 上一行最后一个
 *
 *   分开看是两条"二维"的限制。但合起来看 ——
 *   按【行主序】把矩阵一行一行接起来，得到的整个序列
 *   就是【非递减】的！
 *
 *     1   3   5   7
 *    10  11  16  20    ──接起来──→  1,3,5,7,10,11,16,20,23,30,34,60
 *    23  30  34  60
 *
 *   所以这题根本不需要什么"二维技巧" ——
 *   它就是一个普通的二分查找，只不过数组被"折"成了 m 行。
 *
 * 关键就一个映射公式（把一维下标还原成行列）:
 *
 *     行 = Math.floor(i / n)     ← n 是【列数】，即 matrix[0].length
 *     列 = i % n
 *
 * 于是对整个虚拟数组做标准二分: lo = 0, hi = m * n - 1，
 * 每次取 mid，用上面的公式换成 matrix[行][列] 来比较即可。
 * 时间正好 O(log(m * n))，满足题目要求。
 *
 * 易错点:
 *   1. ★ 映射公式里除的是【列数 n】，不是行数 m ★
 *      矩阵是 m 行 n 列，n = matrix[0].length。
 *      除错了整个映射就乱了 —— 这是本题最容易翻车的地方
 *   2. hi 的初值是 m * n - 1（虚拟数组的最后一个下标）
 *   3. 别用"先按行首元素线性找行、再行内二分"的偷懒做法 ——
 *      那是 O(m + log n)，不满足题目要求的 O(log(m*n))
 *
 * 复杂度: 时间 O(log(m * n))，空间 O(1)
 *
 * ── 另一条路: 两次二分（见 searchMatrixTwoPass） ──
 *   第一次: 在【最后一列】上二分，找出"第一个末元素 >= target 的行"
 *   第二次: 在那一行里二分找 target
 *   也是 O(log m + log n) = O(log(m*n))，但要写两次二分，代码更长。
 */

/**
 * searchMatrix
 * 虚拟一维数组 + 一次二分（推荐）
 * 输入: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
const searchMatrix = function (matrix, target) {
  const m = matrix.length; // 行数
  const n = matrix[0].length; // 【列数】—— 映射公式用的是这个

  let lo = 0;
  let hi = m * n - 1; // 虚拟一维数组的最后一个下标

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    // 一维下标 → 二维下标
    const val = matrix[Math.floor(mid / n)][mid % n];

    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return false;
};

/**
 * searchMatrixTwoPass
 * 两次二分: 先在最后一列定位行，再在该行内找
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
const searchMatrixTwoPass = function (matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;

  // 第一次二分: 找"第一个末元素 >= target 的行"
  // 那一行就是 target 唯一可能在的地方:
  //   它上面的行，末元素全都 < target → 整行都太小
  //   它下面的行，首元素全都 > 它的末元素 >= target → 整行都太大
  let lo = 0;
  let hi = m - 1;
  let row = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (matrix[mid][n - 1] >= target) {
      row = mid;
      hi = mid - 1; // 还可能有更靠上的行，继续往左找
    } else {
      lo = mid + 1;
    }
  }

  if (row === -1) return false; // 所有行的最后一个都 < target

  // 第二次二分: 在这一行里找 target
  lo = 0;
  hi = n - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (matrix[row][mid] === target) return true;
    if (matrix[row][mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return false;
};

// ─── 测试 ───────────────────────────────────────────
// const M = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
// console.log(searchMatrix(M, 3)); // 期望: true
// console.log(searchMatrix(M, 13)); // 期望: false
// console.log(searchMatrix(M, 1)); // 期望: true   ← 左上角
// console.log(searchMatrix(M, 60)); // 期望: true  ← 右下角
// console.log(searchMatrix(M, 0)); // 期望: false  ← 比所有元素都小
// console.log(searchMatrix(M, 99)); // 期望: false ← 比所有元素都大
// console.log(searchMatrix([[1]], 1)); // 期望: true  ← 1x1
// console.log(searchMatrixTwoPass(M, 13)); // 期望: false
//
// 顺便看看把映射公式里的 n 写成 m 会怎样:
// const buggy = (matrix, target) => {
//   const m = matrix.length, n = matrix[0].length;
//   let lo = 0, hi = m * n - 1;
//   while (lo <= hi) {
//     const mid = Math.floor((lo + hi) / 2);
//     const val = matrix[Math.floor(mid / m)][mid % m];   // ← 除错了,应该是 n
//     if (val === target) return true;
//     if (val < target) lo = mid + 1;
//     else hi = mid - 1;
//   }
//   return false;
// };
// console.log(buggy(M, 3)); // 期望 true,实际 false
