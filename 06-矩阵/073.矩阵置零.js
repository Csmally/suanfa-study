/**
 * LeetCode 热题 100 —— 矩阵
 *
 * 73. 矩阵置零 (Set Matrix Zeroes)
 * 难度: 中等 | 标签: 数组、哈希表、矩阵
 * 链接: https://leetcode.cn/problems/set-matrix-zeroes/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个 `m x n` 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：matrix = [[1,1,1],[1,0,1],[1,1,1]]
 *   输出：[[1,0,1],[0,0,0],[1,0,1]]
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 *   输出：[[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 *
 * 提示：
 *   - `m == matrix.length`
 *   - `n == matrix[0].length`
 *   - `1 <= m, n <= 200`
 *   - `-2^31 <= matrix[i][j] <= 2^31 - 1`
 *
 * 进阶：
 *   - 一个直观的解决方案是使用 `O(mn)` 的额外空间，但这并不是一个好的解决方案。
 *   - 一个简单的改进方案是使用 `O(m + n)` 的额外空间，但这仍然不是最好的解决方案。
 *   - 你能想出一个仅使用常量空间的解决方案吗？
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 第一行 + 第一列当"标记板"，O(1) 额外空间
 *
 * 不能直接边扫边清零: 清出来的 0 和原始的 0 分不清，
 * 会把"因清零产生的 0"误当成"原始 0"继续扩散，最后全矩阵变 0
 *
 * 所以分四步:
 *   1. 两个布尔变量记录第一行/第一列本身是否含 0
 *      （它们同时是标记板，本身的状态必须提前单独存下来）
 *   2. 遍历 [1..][1..] 区域: 遇到 0 就在"标记板"上打标记
 *      matrix[i][0] = 0 表示第 i 行要清零
 *      matrix[0][j] = 0 表示第 j 列要清零
 *   3. 根据标记板清零 [1..][1..] 区域:
 *      matrix[i][0] === 0 || matrix[0][j] === 0 → matrix[i][j] = 0
 *   4. 最后处理第一行/第一列本身（根据第 1 步的布尔变量）
 *
 * 关键点: 第 4 步必须放在第 3 步之后——标记板如果先被清零，
 *         后面的行和列就不知道要不要清了
 *
 * 复杂度: 时间 O(m*n)（三次遍历），空间 O(1)
 */

/**
 * setZeroes
 * 输入: matrix = [[1,1,1],[1,0,1],[1,1,1]]
 * @param {number[][]} matrix
 * @return {void} 原地修改,不返回值
 */
const setZeroes = function (matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // 1. 记录第一行/第一列本身是否含 0
  let firstRowHasZero = false;
  let firstColHasZero = false;

  for (let j = 0; j < cols; j++) {
    if (matrix[0][j] === 0) firstRowHasZero = true;
  }
  for (let i = 0; i < rows; i++) {
    if (matrix[i][0] === 0) firstColHasZero = true;
  }

  debugger

  // 2. 用第一行/第一列当标记板：内部元素为 0 时，在对应行首、列首打标记
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0; // 标记第 i 行需要清零
        matrix[0][j] = 0; // 标记第 j 列需要清零
      }
    }
  }

  // 3. 根据标记板清零内部区域（第一行第一列除外）
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // 4. 最后清零第一行/第一列本身（必须在第 3 步之后）
  if (firstRowHasZero) {
    for (let j = 0; j < cols; j++) matrix[0][j] = 0;
  }
  if (firstColHasZero) {
    for (let i = 0; i < rows; i++) matrix[i][0] = 0;
  }

  // 原地修改 matrix，不返回值
};

// ─── 测试 ───────────────────────────────────────────
// const matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
// setZeroes(matrix);
// console.log(matrix); // 期望: [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
