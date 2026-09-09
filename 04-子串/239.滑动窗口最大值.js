/**
 * LeetCode 热题 100 —— 子串
 *
 * 239. 滑动窗口最大值 (Sliding Window Maximum)
 * 难度: 困难 | 标签: 队列、数组、滑动窗口、单调队列、堆（优先队列）、区间最值查询
 * 链接: https://leetcode.cn/problems/sliding-window-maximum/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给你一个整数数组 `nums`，有一个大小为 `k` 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 `k` 个数字。滑动窗口每次只向右移动一位。
 *
 * 返回 滑动窗口中的最大值 。
 *
 * 示例 1：
 *
 *   输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
 *   输出：[3,3,5,5,6,7]
 *   解释：
 *   滑动窗口的位置                最大值
 *   ---------------               -----
 *   [1  3  -1] -3  5  3  6  7       3
 *   1 [3  -1  -3] 5  3  6  7       3
 *   1  3 [-1  -3  5] 3  6  7       5
 *   1  3  -1 [-3  5  3] 6  7       5
 *   1  3  -1  -3 [5  3  6] 7       6
 *   1  3  -1  -3  5 [3  6  7]      7
 *
 * 示例 2：
 *
 *   输入：nums = [1], k = 1
 *   输出：[1]
 *
 * 提示：
 *   - `1 <= nums.length <= 10^5`
 *   - `-10^4 <= nums[i] <= 10^4`
 *   - `1 <= k <= nums.length`
 */


/**
 * maxSlidingWindow
 * 输入: nums = [1,3,-1,-3,5,3,6,7], k = 3
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
const maxSlidingWindow = function (nums, k) {
  const queue = []; // 存下标，且对应的值从大到小
  const result = [];

  debugger
  
  for (let i = 0; i < nums.length; i++) {
    // ① 删除已经离开窗口的下标
    const left = i - k + 1;

    if (queue.length && queue[0] < left) {
      queue.shift();
    }

    // ② 删除所有比当前元素小的队尾元素
    while (
      queue.length &&
      nums[queue[queue.length - 1]] <= nums[i]
    ) {
      queue.pop();
    }

    // ③ 当前元素入队
    queue.push(i);

    // ④ 窗口形成后，队头就是最大值
    if (i >= k - 1) {
      result.push(nums[queue[0]]);
    }
  }

  return result;
};

// ─── 测试 ───────────────────────────────────────────
// console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 期望: [3, 3, 5, 5, 6, 7]
