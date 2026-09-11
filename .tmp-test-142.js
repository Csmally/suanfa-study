const fs = require('fs');
let src = fs.readFileSync('07-链表/142.环形链表 II.js', 'utf8').replace('  debugger\n\n', '');
src += `
let head;
head = toList([3, 2, 0, -4]); head.next.next.next.next = head.next;
console.log('示例1(入口在中段):', detectCycle(head) === head.next, '期望 true');
head = toList([1, 2]); head.next.next = head;
console.log('示例2(入口是头):', detectCycle(head) === head, '期望 true');
console.log('示例3(无环):', detectCycle(toList([1])) === null, '期望 true');
head = toList([1]); head.next = head;
console.log('自环:', detectCycle(head) === head, '期望 true');
head = toList([1, 2, 3, 4, 5]); head.next.next.next.next.next = head.next.next.next; // 尾接第4个节点(值4)
console.log('入口靠后:', detectCycle(head) === head.next.next.next, '期望 true');
console.log('空链表:', detectCycle(null) === null, '期望 true');
`;
eval(src);
