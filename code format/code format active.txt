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
  return /^\s*$/.test(x) ? 0 : x[0] === ' ' ? x.split('').map((k) => k !== ' ').indexOf(true) : 0;
}
function reverseCodeFormat(x) {
  let indentAmount = 0;
  let cumlIndents = [0];
  return x.split('\n').map((line) => {
    if (/^\s*$/.test(line)) {
      return '';
    }
    let lineSpaceAmount = spaceAmount(line);
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
      for (let i = 0; i < popAmount; i++) {
        cumlIndents.pop();
      }
      indentAmount = lineSpaceAmount;
      return result;
    }
    return line;
  }).flat().join('\n');
}
function formatHandler(event) {
  if (!document.activeElement) {
    return;
  }
  if (!['input', 'textarea'].includes(document.activeElement.nodeName.toLowerCase())) {
    return;
  }
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    document.activeElement.value = codeFormat(document.activeElement.value);
    document.activeElement.dispatchEvent(new Event('input'));
    document.activeElement.dispatchEvent(new Event('keydown'));
    document.activeElement.dispatchEvent(new Event('keyup'));
  }
  if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'g') {
    event.preventDefault();
    document.activeElement.value = reverseCodeFormat(document.activeElement.value);
    document.activeElement.dispatchEvent(new Event('input'));
    document.activeElement.dispatchEvent(new Event('keydown'));
    document.activeElement.dispatchEvent(new Event('keyup'));
  }
}
document.addEventListener('keydown', formatHandler);