class BinaryEditor {
  constructor(s) {
    this.str = s.split('');
    this.cursor = this.str.length; // 初始光标在最右侧
  }

  // 检查并删除前导0
  removeLeadingZeros() {
    while (this.str.length > 1 && this.str[0] === '0') {
      this.str.shift();
      this.cursor--;
    }
  }

  insert(char) {
    if (char === '0') {
      // 模拟插入0后，检查是否合法
      let temp = [...this.str];
      temp.splice(this.cursor, 0, '0');
      if (!(temp[0] === '0' && temp.length > 1)) {
        this.str = temp;
        this.cursor++;
      }
    } else if (char === '1') {
      // 插入1，然后删除前导0
      this.str.splice(this.cursor, 0, '1');
      this.cursor++;
      this.removeLeadingZeros();
    }
  }

  deleteLeft() {
    if (this.cursor === 0) return;
    this.str.splice(this.cursor - 1, 1);
    this.cursor--;
    // 删除后检查前导0
    if (this.str[0] === '0') {
      this.removeLeadingZeros();
      this.cursor = 0;
    }
  }

  moveLeft() {
    if (this.cursor > 0) this.cursor--;
  }

  moveRight() {
    if (this.cursor < this.str.length) this.cursor++;
  }

  execute(cmds) {
    for (let c of cmds) {
      if (c === '0' || c === '1') {
        this.insert(c);
      } else if (c === 'B') {
        this.deleteLeft();
      } else if (c === 'L') {
        this.moveLeft();
      } else if (c === 'R') {
        this.moveRight();
      }
    }
    return this.str.join('');
  }
}

// 测试用例
function testBinaryEditor(init, cmds) {
  const editor = new BinaryEditor(init);
  return editor.execute(cmds);
}

console.log(testBinaryEditor('10', '0LLB0R1'));      // 输出："1"
console.log(testBinaryEditor('10', '0LLBB1RRRBB'));  // 输出：""
console.log(testBinaryEditor('0', '01B1L0'));        // 输出："1"
