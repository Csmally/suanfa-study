/**
 * LeetCode 热题 100 —— 栈
 *
 * 394. 字符串解码 (Decode String)
 * 难度: 中等 | 标签: 栈、递归、字符串
 * 链接: https://leetcode.cn/problems/decode-string/
 *
 * ───────────────────────────────────────────
 * 题目描述:
 *
 * 给定一个经过编码的字符串，返回它解码后的字符串。
 *
 * 编码规则为: `k[encoded_string]`，表示其中方括号内部的 `encoded_string` 正好重复 `k` 次。注意 `k` 保证为正整数。
 *
 * 你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
 *
 * 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 `k` ，例如不会出现像 `3a` 或 `2[4]` 的输入。
 *
 * 测试用例保证输出的长度不会超过 `10^5`。
 *
 * 示例 1：
 *
 *   输入：s = "3[a]2[bc]"
 *   输出："aaabcbc"
 *
 * 示例 2：
 *
 *   输入：s = "3[a2[c]]"
 *   输出："accaccacc"
 *
 * 示例 3：
 *
 *   输入：s = "2[abc]3[cd]ef"
 *   输出："abcabccdcdcdef"
 *
 * 示例 4：
 *
 *   输入：s = "abc3[cd]xyz"
 *   输出："abccdcdcdxyz"
 *
 * 提示：
 *   - `1 <= s.length <= 30`
 *   - `s` 由小写英文字母、数字和方括号 `'[]'` 组成
 *   - `s` 保证是一个 有效 的输入。
 *   - `s` 中所有整数的取值范围为 `[1, 300]`
 */

/**
 * ───────────────────────────────────────────
 * 解题思路: 栈 —— 保存"进入方括号之前的现场"
 *
 * ★ 关键转念: 这题难在【嵌套】★
 *
 *   "3[a2[c]]" 里外两层要分别处理，而且内层算完还得接回外层。
 *   嵌套结构的规律是"最近打开的先闭合"，天然又该用栈。
 *
 *   但这里栈存的不是括号本身，而是 ——
 *   【进入这一层方括号"之前"的现场】:
 *
 *     遇到 '['  →  把"当前的重复次数 k"和"当前拼好的字符串"压栈，
 *                  然后清空这两个变量，开始处理方括号【里面】的内容
 *     遇到 ']'  →  弹栈，取回之前那对 k 和字符串；
 *                  把当前串重复 k 次，【接在之前那个字符串后面】
 *
 * 拿 "3[a]2[bc]" 走一遍:
 *
 *   字符    num    cur         栈
 *   ─────────────────────────────────────────────
 *   3       3      ''
 *   [       0      ''          [3, '']       ← 存现场，清空
 *   a       0      'a'
 *   ]       -      'aaa'       []            ← 弹栈，'' + 'a'×3
 *   2       2      'aaa'
 *   [       0      ''          [2, 'aaa']    ← 存现场，清空
 *   b       0      'b'
 *   c       0      'bc'
 *   ]       -      'aaabcbc'   []            ← 弹栈，'aaa' + 'bc'×2
 *
 * 易错点:
 *   1. ★ 遇到 '[' 时要【先存栈、再清空】★
 *      顺序反了，现场数据就丢了
 *   2. ★ 遇到 ']' 时是 prev + cur.repeat(k)，【不是 cur.repeat(k)】★
 *      必须接在"进入方括号之前的字符串"后面。
 *      漏掉 prev 会把前缀整个丢掉 —— 这是本题最常见也最隐蔽的错
 *      （比如 "abc3[cd]xyz" 会答成 "cdcdcdxyz"，丢了 abc）
 *   3. ★ 多位数要累加 ★: num = num * 10 + Number(c)
 *      不能写成 num = Number(c)。题目说 k 最大 300，会有两位、三位数
 *   4. 字母是【追加】到 cur（cur += c），不是覆盖
 *
 * 复杂度: 时间 O(n)（每个字符处理一次；repeat 和拼接按输出长度算），
 *         空间 O(n)（栈深度最多是嵌套层数）
 *
 * ── 另一条路: 递归（见 decodeStringRecursive） ──
 *   用下标 i 一路扫过去:
 *     - 遇到 '[' → 递归进去解析里面的内容，回来后 cur += inner.repeat(num)
 *     - 遇到 ']' → 把当前累计的 cur 返回给上一层
 *   本质和栈写法一模一样 —— 只不过"保存现场 / 恢复现场"这件事
 *   交给【系统的调用栈】去做了，所以代码里看不见显式的栈。
 */

/**
 * decodeString
 * 栈写法
 * 输入: s = "3[a]2[bc]"
 * @param {string} s
 * @return {string}
 */
const decodeString = function (s) {
  const stack = []; // 每项是 [重复次数, 进入方括号之前的字符串]
  let cur = ''; // 当前正在拼的字符串
  let num = 0; // 当前正在读的数字

  for (const c of s) {
    if (c >= '0' && c <= '9') {
      // ★ 累加，处理多位数（"12[a]" 要读出 12，不是 1 再 2）
      num = num * 10 + Number(c);
    } else if (c === '[') {
      // ★ 先存现场，再清空
      stack.push([num, cur]);
      num = 0;
      cur = '';
    } else if (c === ']') {
      const [k, prev] = stack.pop(); // 恢复现场
      // ★ 接在 prev 后面，别漏掉它
      cur = prev + cur.repeat(k);
    } else {
      cur += c; // 普通字母：追加
    }
  }

  return cur;
};

/**
 * decodeStringRecursive
 * 递归写法: 用系统调用栈代替显式栈
 * @param {string} s
 * @return {string}
 */
const decodeStringRecursive = function (s) {
  let i = 0; // 全局扫描下标

  const dfs = () => {
    let cur = '';
    let num = 0;

    while (i < s.length) {
      const c = s[i];

      if (c >= '0' && c <= '9') {
        num = num * 10 + Number(c);
        i++;
      } else if (c === '[') {
        i++; // 跳过 '['
        const inner = dfs(); // 递归解析方括号里的内容
        cur += inner.repeat(num); // 重复后接上
        num = 0;
        // 此时 s[i] 是这一层的 ']'，留给下一轮循环处理
      } else if (c === ']') {
        i++; // 跳过 ']'
        return cur; // ★ 把本层的结果交还给上一层
      } else {
        cur += c;
        i++;
      }
    }

    return cur;
  };

  return dfs();
};

// ─── 测试 ───────────────────────────────────────────
// console.log(decodeString('3[a]2[bc]'));   // 期望: 'aaabcbc'     ← 示例 1
// console.log(decodeString('3[a2[c]]'));    // 期望: 'accaccacc'  ← 示例 2，嵌套
// console.log(decodeString('2[abc]3[cd]ef')); // 期望: 'abcabccdcdcdef' ← 示例 3
// console.log(decodeString('abc3[cd]xyz')); // 期望: 'abccdcdcdxyz' ← 示例 4，考验"接在 prev 后面"
// console.log(decodeString('abc'));         // 期望: 'abc'        ← 没有方括号
// console.log(decodeString('12[ab]'));      // 期望: 'ab'×12      ← 多位数！
// console.log(decodeString('3[3[3[a]]]'));  // 期望: 27 个 a      ← 三层嵌套
// console.log(decodeStringRecursive('3[a2[c]]')); // 期望: 'accaccacc'
//
// 顺便看看漏掉 prev 会错成什么样(把 ']' 那行改成 cur = cur.repeat(k)):
// console.log('abc3[cd]xyz' 会变成 'cdcdcdxyz' —— 前缀 abc 和 xyz 都没了)
