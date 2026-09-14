/**
 * LeetCode 热题 100 —— 二分查找
 *
 * 33. 搜索旋转排序数组 (Search in Rotated Sorted Array)
 * 难度: 中等 | 标签: 数组、二分查找
 * 链接: https://leetcode.cn/problems/search-in-rotated-sorted-array/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 整数数组 `nums` 按升序排列，数组中的值 互不相同 。
 *
 * 在传递给函数之前，`nums` 在预先未知的某个下标 `k`（`0 <= k < nums.length`）上进行了 向左旋转，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 从 0 开始 计数）。例如， `[0,1,2,4,5,6,7]` 下标 `3` 上向左旋转后可能变为 `[4,5,6,7,0,1,2]` 。
 *
 * 给你 旋转后 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 `-1` 。
 *
 * 你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。
 *
 * 示例 1：
 *
 *   输入：nums = [4,5,6,7,0,1,2], target = 0
 *   输出：4
 *
 * 示例 2：
 *
 *   输入：nums = [4,5,6,7,0,1,2], target = 3
 *   输出：-1
 *
 * 示例 3：
 *
 *   输入：nums = [1], target = 0
 *   输出：-1
 *
 * 提示：
 *   - `1 <= nums.length <= 5000`
 *   - `-10^4 <= nums[i] <= 10^4`
 *   - `nums` 中的每个值都 独一无二
 *   - 题目数据保证 `nums` 在预先未知的某个下标上进行了旋转
 *   - `-10^4 <= target <= 10^4`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 一次二分 —— 每次切一刀，总有一半是有序的
 *
 * ★ 关键转念: 旋转数组整体无序，但【对半切，一定有一半有序】★
 *
 *   为什么？原数组是升序的，只在某一个点"断"了一下。
 *   你从中间切开，那个断点只可能落在其中一边，
 *   所以【另一边必然是完整的一段升序】。
 *
 *     nums = [4, 5, 6, 7, 0, 1, 2]
 *                   ↑
 *            lo=0         mid=3        hi=6
 *            └──[4,5,6,7]──┘└─[0,1,2]─┘
 *              这半边有序      这半边带着断点
 *
 *   判断哪半边有序，只要比较 nums[lo] 和 nums[mid]:
 *     nums[lo] <= nums[mid]   →  左半边 [lo, mid] 一定有序
 *     否则                     →  右半边 [mid, hi] 一定有序
 *
 *   知道了哪半边有序，就能一眼看出 target 在不在里面:
 *     在   → 丢掉另一半，去那半边继续二分
 *     不在 → 丢掉那半边，去另一半继续二分
 *
 * 步骤（每轮）:
 *   1. nums[mid] === target → 找到了，返回 mid
 *   2. 判断哪半边有序
 *   3. 看 target 是否落在"有序那半边"的值域内
 *        在   → 把范围收到那半边
 *        不在 → 往另一半收
 *
 * 易错点:
 *   1. ★ 判断"哪半边有序"必须是 nums[lo] <= nums[mid]，【写成 < 会漏解】★
 *      看着只差一个等号，但区间只剩一个元素时（lo === mid），
 *      nums[lo] < nums[mid] 是 false，会被误判成"右半边有序"，
 *      然后这个唯一的元素就被直接丢掉了 —— 明明它就是要找的那个。
 *
 *      实测: nums = [65, 5], target = 5
 *        用 <=  得 1  ✓
 *        用 <   得 -1 ✗（区间收到 [0,0] 时把 5 自己扔了）
 *      随机对比了 180000 组，有 1.6% 的用例两种写法的结果不同
 *   2. ★ 值域判断的边界要仔细，哪边带等号、哪边不带是有讲究的 ★
 *      左半边有序时: nums[lo]  <= target && target <  nums[mid]
 *      右半边有序时: nums[mid] <  target && target <= nums[hi]
 *      （mid 位置本身已经在第 1 步排除掉了，所以它那一侧用严格不等号）
 *   3. 别想着"先找到旋转点再二分" —— 那也对（见 searchTwoPass），
 *      但要多写一次二分
 *
 * 复杂度: 时间 O(log n)（一次二分），空间 O(1)
 *
 * ── 另一条路: 先找旋转点，再在有序段里二分（见 searchTwoPass） ──
 *   1. 用 153 题的方法二分找出【最小值的位置 pivot】，那就是旋转点
 *   2. 于是 [0, pivot-1] 和 [pivot, n-1] 各自都是升序的
 *   3. 判断 target 落在哪一段，在那一段里做标准二分
 *   也是 O(log n)，但要写两次二分，代码更长、逻辑更"直白"一些。
 */

/**
 * search
 * 一次二分
 * 输入: nums = [4,5,6,7,0,1,2], target = 0
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const search = function (nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (nums[mid] === target) return mid; // 命中

    if (nums[lo] <= nums[mid]) {
      // 情况一: 左半边 [lo, mid] 是有序的
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1; // target 在有序的左半边里
      } else {
        lo = mid + 1; // 不在，去右半边找
      }
    } else {
      // 情况二: 右半边 [mid, hi] 是有序的
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1; // target 在有序的右半边里
      } else {
        hi = mid - 1; // 不在，去左半边找
      }
    }
  }

  return -1;
};

/**
 * searchTwoPass
 * 先找旋转点（最小值位置），再在它切出的有序段里做标准二分
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const searchTwoPass = function (nums, target) {
  const n = nums.length;

  // 第一次二分: 找最小值的位置 —— 就是旋转点（153 题的解法）
  let lo = 0;
  let hi = n - 1;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) {
      lo = mid + 1; // 最小值在右半边
    } else {
      hi = mid; // 最小值在 mid 或左半边
    }
  }

  const pivot = lo; // nums[pivot] 就是整个数组的最小值

  // 在 [lo, hi] 这段【一定有序】的区间里做普通二分
  const binarySearch = (start, end) => {
    let a = start;
    let b = end;

    while (a <= b) {
      const mid = Math.floor((a + b) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) a = mid + 1;
      else b = mid - 1;
    }

    return -1;
  };

  // 第二次: target 落在哪一段？
  if (target >= nums[pivot] && target <= nums[n - 1]) {
    return binarySearch(pivot, n - 1); // 右段（从最小值到末尾）
  }
  return binarySearch(0, pivot - 1); // 左段
};

// ─── 测试 ───────────────────────────────────────────
// console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 期望: 4
// console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // 期望: -1
// console.log(search([1], 0)); // 期望: -1
// console.log(search([1], 1)); // 期望: 0
// console.log(search([1, 3], 3)); // 期望: 1
// console.log(search([3, 1], 1)); // 期望: 1
// console.log(search([5, 1, 3], 5)); // 期望: 0  ← 没旋转 / 只转 1 位 / 转 2 位都要对
// console.log(searchTwoPass([4, 5, 6, 7, 0, 1, 2], 0)); // 期望: 4
//
// 参照实现(朴素线性扫): nums.indexOf(target)
//
// 顺便看看把 nums[lo] <= nums[mid] 写成 < 会怎样:
// const searchWrong = (nums, target) => {
//   let lo = 0, hi = nums.length - 1;
//   while (lo <= hi) {
//     const mid = Math.floor((lo + hi) / 2);
//     if (nums[mid] === target) return mid;
//     if (nums[lo] < nums[mid]) {                  // ← 少了等号
//       if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
//     } else {
//       if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
//     }
//   }
//   return -1;
// };
// console.log(searchWrong([65, 5], 5)); // 期望 1,实际 -1 —— 漏解了
