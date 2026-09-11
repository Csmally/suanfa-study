/**
 * LeetCode 热题 100 —— 矩阵
 *
 * 54. 螺旋矩阵 (Spiral Matrix)
 * 难度: 中等 | 标签: 数组、矩阵、模拟
 * 链接: https://leetcode.cn/problems/spiral-matrix/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个 `m` 行 `n` 列的矩阵 `matrix` ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
 *
 * 示例 1：
 *
 * [图片]
 *
 *   输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
 *   输出：[1,2,3,6,9,8,7,4,5]
 *
 * 示例 2：
 *
 * [图片]
 *
 *   输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 *   输出：[1,2,3,4,8,12,11,10,9,5,6,7]
 *
 * 提示：
 *   - `m == matrix.length`
 *   - `n == matrix[i].length`
 *   - `1 <= m, n <= 10`
 *   - `-100 <= matrix[i][j] <= 100`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 收缩边界法（模拟螺旋走一圈，边走边收缩四条边界）
 *
 * 用 top / bottom / left / right 四条边界圈住"还没走过的区域"，
 * 每圈按顺时针走四步，每走完一条边，对应边界就往里收一格:
 *   1. 上边界: 左 → 右（固定 top 行），走完 top++
 *   2. 右边界: 上 → 下（固定 right 列），走完 right--
 *   3. 下边界: 右 → 左（固定 bottom 行），走完 bottom--
 *   4. 左边界: 下 → 上（固定 left 列），走完 left++
 * 边界交叉（top > bottom 或 left > right）时螺旋结束
 *
 * 关键点: 每个 for 循环都加 result.length < total 判断——
 *         非方阵（如单行/单列）走完前一两步就已经全部收集完，
 *         不加判断后面的方向会重复收集
 *
 * 例: [[1,2,3],[4,5,6],[7,8,9]]
 *   ①上: 1,2,3 → ②右: 6,9 → ③下: 8,7 → ④左: 5
 *   → [1,2,3,6,9,8,7,4,5]（中间 5 是最后一圈的"左"）
 *
 * 复杂度: 时间 O(m*n)（每个格子恰好访问一次），空间 O(1)（除输出外）
 */

/**
 * spiralOrder
 * 输入: matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * @param {number[][]} matrix
 * @return {number[]}
 */
const spiralOrder = function (matrix) {
  const result = [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const total = rows * cols; // 元素总数，作为循环终点

  // 四条边界
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;

  debugger

  while (result.length < total) {
    // 1. 上边界: 左 → 右，走完 top 下移
    for (let j = left; j <= right && result.length < total; j++) {
      result.push(matrix[top][j]);
    }
    top++;

    // 2. 右边界: 上 → 下，走完 right 左移
    for (let i = top; i <= bottom && result.length < total; i++) {
      result.push(matrix[i][right]);
    }
    right--;

    // 3. 下边界: 右 → 左，走完 bottom 上移
    for (let j = right; j >= left && result.length < total; j--) {
      result.push(matrix[bottom][j]);
    }
    bottom--;

    // 4. 左边界: 下 → 上，走完 left 右移
    for (let i = bottom; i >= top && result.length < total; i--) {
      result.push(matrix[i][left]);
    }
    left++;
  }

  return result;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])); // 期望: [1, 2, 3, 6, 9, 8, 7, 4, 5]
