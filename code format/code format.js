function codeFormat(x) {
  let indentLevel = 0;
  return x.split('\n').map((line) => {
    if (/^\s*$/.test(line)) {
      return '';
    }
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
  let cumlIndents = [0];
  return x.split('\n').map((line) => {
    let lineSpaceAmount = spaceAmount(line);
    if (/^\s*$/.test(line)) {
      return '';
    }
    line = line.trimLeft();
    if (/^\\*[\]\[]{3}$/.test(line)) {
      return '\\' + line;
    }
    if (lineSpaceAmount > indentAmount) {
      indentAmount = lineSpaceAmount;
      cumlIndents.push(indentAmount);
      return [']]]', line];
    }
    if (lineSpaceAmount < indentAmount) {
      if (!cumlIndents.includes(lineSpaceAmount)) {
        throw new SyntaxError('Indentation Error.');
      }
      const popAmount = cumlIndents.length - (cumlIndents.indexOf(lineSpaceAmount) + 1);
      const result = Array.from({length: popAmount}, () => '[[[');
      result.push(line);
      cumlIndents.pop(popAmount);
      indentAmount = lineSpaceAmount;
      return result;
    }
    return line;
  }).flat().join('\n');
}