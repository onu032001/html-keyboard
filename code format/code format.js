function codeFormat(x) {
  let indentLevel = 0;
  return x.split('\n').map((line) => {
    if (/^\\+[\]\[]{3}$/.test(line)) {
      return '  '.repeat(indentLevel) + line.substring(1);
    }
    if (line === ']]]') {
      indentLevel += 1;
      return null;
    }
    if (line === '[[[') {
      if (indentLevel > 0) {
        indentLevel -= 1;
      }
      return null;
    }
    return '  '.repeat(indentLevel) + line;
  }).filter((item) => item !== null).join('\n');
}
function spaceAmount(x) {
  return x[0] === ' ' ? x.split('').map((k) => k !== ' ').indexOf(true) + 1 : 0;
}
function reverseCodeFormat(x) {
  let indentAmount = 0;
  return x.split('\n').map((line) => {
    let lineSpaceAmount = spaceAmount(line);
    line = line.trimLeft();
    if (/^\s*$/.test(line)) {
      return '';
    }
    if (/^\\*[\]\[]{3}$/.test(line)) {
      return '\\' + line;
    }
    if (lineSpaceAmount > indentAmount) {
      indentAmount = lineSpaceAmount;
      return [']]]', line];
    }
    if (lineSpaceAmount < indentAmount) {
      indentAmount = lineSpaceAmount;
      return ['[[[', line];
    }
    return line;
  }).flat().join('\n');
}