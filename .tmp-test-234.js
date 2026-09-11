const fs = require('fs');
let src = fs.readFileSync('07-链表/234.回文链表.js', 'utf8');
src += `
const cases = [
  [[1, 2, 2, 1], true],
  [[1, 2], false],
  [[1], true],
  [[1, 2, 3, 2, 1], true],
  [[1, 1], true],
  [[1, 2, 2, 2], false],
];
for (const [arr, expected] of cases) {
  const r1 = isPalindrome(toList(arr));
  const r2 = isPalindromeTwoPointers(toList(arr));
  console.log('数组法:', JSON.stringify(arr), r1, '双指针:', r2, '期望', expected, r1 === expected && r2 === expected ? '✓' : '✗');
}
`;
eval(src);
