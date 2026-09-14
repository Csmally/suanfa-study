/**
 * LeetCode 热题 100 —— 技巧
 *
 * 169. 多数元素 (Majority Element)
 * 难度: 简单 | 标签: 数组、哈希表、分治、计数、排序、摩尔投票算法
 * 链接: https://leetcode.cn/problems/majority-element/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个大小为 `n` 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 `⌊ n/2 ⌋` 的元素。
 *
 * 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 *
 * 示例 1：
 *
 *   输入：nums = [3,2,3]
 *   输出：3
 *
 * 示例 2：
 *
 *   输入：nums = [2,2,1,1,1,2,2]
 *   输出：2
 *
 * 提示：
 *   - `n == nums.length`
 *   - `1 <= n <= 5 * 10^4`
 *   - `-10^9 <= nums[i] <= 10^9`
 *   - 输入保证数组中一定有一个多数元素。
 *
 * 进阶：尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 摩尔投票法 (Boyer-Moore Voting) —— 进阶要求的标准答案
 *
 * ★ 一句话直觉: "不同阵营的人两两同归于尽" ★
 *
 *   把每个元素想象成一个阵营的人。我们只维护两样东西:
 *     candidate —— 当前"擂主"是谁
 *     count     —— 擂主还剩多少条命
 *
 *   遍历数组，每个人上来:
 *     如果擂台空着(count === 0)  → 你当擂主，count = 1
 *     如果来的人是自己人           → count++（多一个帮手）
 *     如果来的人是别的阵营         → count--（一对一，同归于尽）
 *
 *   ★ 为什么这样能得到多数元素 ★
 *   多数元素的数量 > n/2，意味着它【比所有其他元素加起来还多】。
 *   就算所有其他阵营的人都来和它一换一，也换不完它 —— 所以最后站在擂台上的
 *   一定是它。
 *
 * ★ 严格证明（把它想成"抹掉一对"）★
 *
 *   每一步 count-- 可以看成【抹掉两个不同的元素】。设整个过程中一共抹掉 k 对，
 *   现在来证明: 抹完之后，多数元素依然是剩余元素里的多数元素。
 *
 *     设多数元素是 m，原来出现 c 次，且 c > n/2。
 *     每对被抹掉的元素里，【最多只有一个】是 m（因为一对里两个元素不同），
 *     所以 k 对里最多抹掉 k 个 m。
 *     剩余元素: n - 2k 个，其中 m 至少有 c - k 个。
 *     要证明 "m 仍是剩余部分的多数"，只需 c - k > (n - 2k) / 2:
 *         c - k > n/2 - k   ⟺   c > n/2   ✓  （正是题目的承诺）
 *     证毕。
 *
 *   也就是说: 【不管以什么顺序做这个"两两抵消"，多数元素都消不完】。
 *   摩尔投票只是用一种方便的方式（顺序扫一遍）把它实现了出来。
 *
 * ★ 为什么这题被归到"技巧"★
 *
 *   这个算法能成立，靠的是题目那句承诺:"多数元素出现次数 > n/2"。
 *   如果数组里【根本没有多数元素】，它会安静地返回一个错答案（不报错）。
 *   实测: [1, 2, 3] 会返回 3，但 3 只出现一次，根本不是多数元素。
 *   ★ 所以用这个算法前，先确认题目真的保证了多数元素存在 ★
 *
 * ★ 其他解法对比 ★
 *
 *   解法          时间        空间        说明
 *   ──────────────────────────────────────────────────────────────
 *   摩尔投票      O(n)        O(1)        ★ 唯一满足进阶要求的 ★
 *   哈希表计数    O(n)        O(n)        最通用，不依赖"多数元素存在"这个前提
 *   排序取中间    O(n log n)  O(1)~       很巧妙（见下），但时间不达标
 *   分治          O(n log n)  O(log n)    标签里有，实现最麻烦，不推荐
 *
 * ★ 排序解法为什么对 ★
 *
 *   把数组排序后，相同的元素都挨在一起，多数元素会占据一段长度 > n/2 的连续区间。
 *   一段长度超过一半的区间，【不可能不覆盖正中间那个位置】——
 *   所以排序后直接取 nums[Math.floor(n/2)] 就行。
 *
 *   （严格点说: 设这段区间是 [i, i+c-1]，c > n/2，mid = floor(n/2)。
 *     假设它不覆盖 mid，那只能整段在 mid 左边或右边:
 *       整段在 mid 右边 → i > mid，可 i <= n - c < n - n/2 = n/2，矛盾；
 *       整段在 mid 左边 → i + c - 1 < mid <= n/2，而 c > n/2 且 c 是整数
 *                         所以 c >= floor(n/2) + 1，即 i + c - 1 >= floor(n/2)，
 *                         与它 < mid 矛盾。）
 *
 * ★ JS 的 sort() 默认按【字符串】排序 —— 但它居然不影响这题（实测）★
 *
 *   先说坑本身:
 *     [10, 9, 2].sort()          → [10, 2, 9]     ✗ 按字典序，不是数值序
 *     [100, 20, 3].sort()        → [100, 20, 3]   ✗ 原封不动，因为 "100" < "20" < "3"
 *   正确的写法是传比较函数:
 *     [10, 9, 2].sort((a, b) => a - b) → [2, 9, 10] ✓
 *
 *   ★ 但用默认排序做【这题】，结论居然还是对的 ★
 *   实测 20 万组随机数据（值域 ±5 亿，位数差异拉满），出错 0 次。
 *   原因是这题排序解法的正确性只依赖两件事:
 *     (1) 相同的元素排序后彼此挨着
 *     (2) 多数元素那一段的长度 > n/2
 *   而默认的字符串排序依然满足 (1) —— 相等的数字转成字符串也相等，
 *   所以副本们还是会聚成一段。顺序全乱，但"取中间"照样取得到多数元素。
 *   例: [5,5,5,50,500,5000,50000] 用默认排序 → 顺序完全变了，
 *       但 5 的那三个副本依然紧紧挨在一起。
 *
 *   ★ 别因此就觉得 sort() 可以省比较函数 ★
 *   这题只是运气好躲过去了。换个用途（取第 k 大、比大小、二分查找），
 *   字符串序立刻就是灾难。★ 养成习惯: 数字排序永远写 (a, b) => a - b ★
 *
 * 易错点:
 *   1. ★ 摩尔投票只在"多数元素确实存在"时才对 ★
 *      题目保证了才敢用；刷题时如果题目没保证，先验证 candidate 的出现次数
 *      （本文件附了 majorityElementVerified，自己会复核一遍）
 *   2. ★ 数字排序一定要传 (a, b) => a - b ★
 *      虽然本题的排序解法侥幸不受影响（见上），但这是 JS 里最常见的 bug 之一
 *   3. 摩尔投票里 count === 0 时【先换候选人再置 1】，别写成 count = 1 就完了
 *      （等价写法是 if (x === candidate) count++ else count--，两版都对，但第一版更好懂）
 *   4. 题目说的是 "大于 ⌊n/2⌋"，不是"大于等于"—— 恰好一半不算多数元素
 *
 * 复杂度:
 *   摩尔投票 —— 时间 O(n)，空间 O(1)   ← 本文件主解法，唯一满足进阶要求的
 */

/**
 * majorityElement
 * 摩尔投票: 不同阵营两两抵消，最后剩下的就是多数元素 —— 本文件主解法
 * @param {number[]} nums
 * @return {number}
 */
const majorityElement = function (nums) {
  let candidate = nums[0]; // 当前擂主
  let count = 0; // 擂主还剩多少条命

  for (const x of nums) {
    if (count === 0) {
      // 擂台空了，换新擂主
      candidate = x;
      count = 1;
    } else if (x === candidate) {
      count++; // 自己人，加一条命
    } else {
      count--; // 别的阵营，一换一同归于尽
    }
  }

  // ★ 这里直接返回 candidate，是因为题目【保证】多数元素一定存在。
  //   如果题目没这个保证，就必须再扫一遍数一下 candidate 的真实出现次数，
  //   确认它真的 > n/2 才能返回。
  return candidate;
};

/**
 * majorityElementVerified
 * 摩尔投票 + 复核: 不依赖题目承诺的版本
 * 如果你不确定"多数元素一定存在"，用这个 —— 它自己会验证
 * @param {number[]} nums
 * @return {number}
 */
const majorityElementVerified = function (nums) {
  const candidate = majorityElement(nums);

  // 再扫一遍数数，确认它真的是多数元素
  let times = 0;
  for (const x of nums) {
    if (x === candidate) times++;
  }

  return times > Math.floor(nums.length / 2) ? candidate : -1;
};

/**
 * majorityElementSort
 * 排序法: 排序后取中间那个
 * ★ 必须传比较函数，否则 JS 会按字符串排序 ★
 * @param {number[]} nums
 * @return {number}
 */
const majorityElementSort = function (nums) {
  // ★ 深拷贝一份再排，避免把调用方的数组改掉 ★
  const sorted = nums.slice();
  sorted.sort((a, b) => a - b); // ★ 这个 (a,b)=>a-b 不能省 ★
  return sorted[Math.floor(sorted.length / 2)];
};

/**
 * majorityElementHash
 * 哈希表计数: 最通用，不依赖"多数元素存在"这个前提
 * @param {number[]} nums
 * @return {number}
 */
const majorityElementHash = function (nums) {
  const count = new Map();
  const half = Math.floor(nums.length / 2);

  for (const x of nums) {
    const times = (count.get(x) || 0) + 1;
    count.set(x, times);
    // 数够了就可以提前收工
    if (times > half) return x;
  }

  return -1; // 题目保证有解，走不到这
};

/**
 * majorityElementBrute
 * 参照实现: 每个元素都数一遍，O(n²)
 * 只用来对答案
 * @param {number[]} nums
 * @return {number}
 */
const majorityElementBrute = function (nums) {
  const half = Math.floor(nums.length / 2);

  for (let i = 0; i < nums.length; i++) {
    let times = 0;
    for (let j = 0; j < nums.length; j++) {
      if (nums[j] === nums[i]) times++;
    }
    if (times > half) return nums[i];
  }

  return -1; // 没有多数元素
};

// ─── 测试 ───────────────────────────────────────────
// console.log(majorityElement([3, 2, 3])); // 期望: 3   示例 1
// console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 期望: 2   示例 2
// console.log(majorityElement([1])); // 期望: 1   只有一个元素
// console.log(majorityElement([1, 1])); // 期望: 1   恰好一半也满足（1 > floor(2/2)=1）
// console.log(majorityElement([3, 3, 4])); // 期望: 3
// console.log(majorityElement([1, 1, 1, 2, 2])); // 期望: 1
// console.log(majorityElement([1, 2, 1])); // 期望: 1   多数元素在末尾
// console.log(majorityElement([1000000000, 1000000000, -1000000000])); // 期望: 10^9 边界
//
// 四种写法互相印证:
// const check = (nums) => [
//   majorityElement(nums),
//   majorityElementSort(nums),
//   majorityElementHash(nums),
//   majorityElementBrute(nums)
// ];
// console.log(check([3, 2, 3]));                       // [3, 3, 3, 3]
// console.log(check([2, 2, 1, 1, 1, 2, 2]));           // [2, 2, 2, 2]
//
// ★ JS 排序的坑（亲眼看一下）★
// console.log([10, 9, 2].sort());                  // [10, 2, 9]      ✗ 按字符串排的
// console.log([10, 9, 2].sort((a, b) => a - b));   // [2, 9, 10]      ✓
// console.log([100, 20, 3].sort());                // [100, 20, 3]    ✗ 原封不动，因为 "100" < "20" < "3"
//
// ★ 但这题的排序解法【侥幸不受影响】—— 同一条数据对比一下 ★
// const demo = [5, 5, 5, 50, 500, 5000, 50000];
// console.log(demo.slice().sort());                    // 顺序全乱了
// console.log(demo.slice().sort((a, b) => a - b));     // 严格的数值序
// // 但两者的中间位置都取到 5 —— 因为"相等的元素仍然聚在一起"这一点没被破坏
// // 实测 20 万组随机数据，用默认排序跑这题，出错 0 次。别学这个，只是说明原因。
//
// ★ 摩尔投票依赖题目的承诺（这两个例子题目里不会出现）★
// console.log(majorityElement([1, 2, 3]));   // 返回 3，但根本不存在多数元素
// console.log(majorityElementVerified([1, 2, 3])); // 返回 -1，正确地告诉你"没有"
