function buttonMap(inputClassPar, inputPar, buttonsPar) {
  this.inputClassPar = inputClassPar;
  this.inputPar = inputPar;
  this.buttonsPar = buttonsPar;
  this.shiftMode = false;
  this.symbolMode = false;
  this.originalKeys = ['abcdefg', 'hijklmn', 'opqrstu', 'vwxyz', 'ㄱㄴㄷㄹㅁㅂㅅ', 'ㅇㅈㅊㅋㅌㅍㅎ', 'ㅏㅑㅓㅕㅗㅛㅜ', 'ㅠㅡㅣㅐㅒㅔㅖ'];
  this.shiftedKeys = ['ABCDEFG', 'HIJKLMN', 'OPQRSTU', 'VWXYZ', 'ㄲㄴㄸㄹㅁㅃㅆ', 'ㅇㅉㅊㅋㅌㅍㅎ', 'ㅏㅑㅓㅕㅗㅛㅜ', 'ㅠㅡㅣㅐㅒㅔㅖ'];
  this.symbolKeys = ['123\'"`', '456,;:', '789<>/', '0.-!@#', '$%&*()', '?=_+^\\', '[]{}~|'];
  this.buttonsPar.style.backgroundColor = '#303030';
  this.buttonsPar.style.width = 'fit-content';
  this.buttonsPar.style.height = 'fit-content';
  this.appendButtonByObjectArray = function (objectArray) {
    for (const objectPar of objectArray) {
      if (objectPar.type === 'break') {
        const breakEl = document.createElement('br');
        this.buttonsPar.appendChild(breakEl);
      } else {
        const button = document.createElement('button');
        button.style.backgroundColor = '#303030';
        button.style.color = 'white';
        button.style.fontFamily = 'sans-serif';
        button.style.borderTop = '2px solid #505050';
        button.style.borderRight = '2px solid #101010';
        button.style.borderBottom = '2px solid #101010';
        button.style.borderLeft = '2px solid #505050';
        button.style.fontSize = '13px';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.margin = '5px';
        for (const objectArrayKey in objectPar) {
          if (!Object.hasOwn(objectPar, objectArrayKey)) continue;
          const objectArrayValue = objectPar[objectArrayKey];
          button[objectArrayKey] = objectArrayValue;
        }
        this.buttonsPar.appendChild(button);
      }
    }
  }
  this.updateButtons = function () {
    for (const button of Array.from(this.buttonsPar.childNodes)) {
      this.buttonsPar.removeChild(button);
    }
    const buttonList = this.symbolMode ? this.symbolKeys : this.shiftMode ? this.shiftedKeys : this.originalKeys;
    for (let index = 0; index < buttonList.length; index++) {
      for (const letter of buttonList[index]) {
        this.appendButtonByObjectArray([{innerText: letter, onclick: () => this.inputClassPar.inputHandler(letter)}]);
      }
      if (index < buttonList.length - 1) {
        this.appendButtonByObjectArray([{type: 'break'}]);
      }
    }
    this.appendButtonByObjectArray([
      {type: 'break'},
      {innerText: '⇧', onclick: () => { this.shiftMode = !this.shiftMode; this.updateButtons(); }},
      {innerText: '?!1', onclick: () => { this.symbolMode = !this.symbolMode; this.updateButtons(); }},
      {innerText: '␣', onclick: () => { this.inputClassPar.inputHandler(' ') }},
      {innerText: '⌫', onclick: () => { this.inputClassPar.backspace(); }}
    ]);
  }
}
function letterMap() {
  this.consoMap = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
  this.vowelMap = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
  this.final_consoMap = 'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.split('');
  this.checkIfKorean = (letter) => (
    this.consoMap.includes(letter) ||
    this.vowelMap.includes(letter) ||
    this.final_consoMap.includes(letter)
  );
}
function createInput(inputElement) {
  this.editorElement = document.createElement('div');
  this.inputElement = inputElement;
  this.buttonsElement = document.createElement('div');
  this.inputElement.after(this.editorElement);
  this.editorElement.append(this.inputElement, this.buttonsElement);
  this.letterMap = new letterMap();
  this.buttonMap = new buttonMap(this, this.inputElement, this.buttonsElement);
  this.buttonMap.updateButtons();
  this.update = function () {
    this.inputElement.value = this.value;
    this.inputElement.focus();
    this.inputElement.selectionStart = this.selectionStart;
    this.inputElement.selectionEnd = this.selectionEnd;
  }
  this.updateSettings = function () {
    this.value = this.inputElement.value;
    this.selectionStart = Math.min(this.inputElement.selectionStart, this.inputElement.selectionEnd);
    this.selectionEnd = Math.max(this.inputElement.selectionStart, this.inputElement.selectionEnd);
    this.deleteSyllable = true;
  }
  this.inputElement.onclick = () => this.updateSettings();
  this.inputElement.onkeydown = () => this.updateSettings();
  this.inputElement.onkeyup = () => this.updateSettings();
  this.inputElement.onselect = () => this.updateSettings();
  this.value = '';
  this.selectionStart = 0;
  this.selectionEnd = 0;
  this.deleteSyllable = true;
  this.combine = function (conso, vowel, final_conso) {
    const consoIndex = this.letterMap.consoMap.indexOf(conso);
    const vowelIndex = this.letterMap.vowelMap.indexOf(vowel);
    const final_consoIndex = final_conso === '' ? 0 : this.letterMap.final_consoMap.indexOf(final_conso) + 1;
    if (vowel === '' && final_conso === '') {
      return conso;
    } else if (conso === '' && final_conso === '') {
      return vowel;
    }
    return String.fromCharCode(0xAC00 + consoIndex * 28 * 21 + vowelIndex * 28 + final_consoIndex);
  }
  this.separate = function (letter) {
    if (this.letterMap.consoMap.includes(letter)) {
      return [letter, '', ''];
    } else if (this.letterMap.vowelMap.includes(letter)) {
      return ['', letter, ''];
    }
    const letterIndex = letter.charCodeAt() - 0xAC00;
    const consoIndex = Math.floor(letterIndex / (28 * 21));
    const vowelIndex = Math.floor(letterIndex / 28) % 21;
    const final_consoIndex = letterIndex % 28;
    const conso = this.letterMap.consoMap[consoIndex];
    const vowel = this.letterMap.vowelMap[vowelIndex];
    const final_conso = final_consoIndex === 0 ? '' : this.letterMap.final_consoMap[final_consoIndex - 1];
    return [conso, vowel, final_conso];
  }
  this.insertLetter = function (currentValue, letter) {
    if (currentValue.length === 0 || this.deleteSyllable) {
      return currentValue + letter;
    }
    let lastValue = currentValue.slice(0, currentValue.length - 1);
    let lastLetter = currentValue[currentValue.length - 1];
    const separated = this.separate(lastLetter);
    if (this.letterMap.vowelMap.includes(letter)) {
      if (separated[1] === '' && separated[2] === '') {
        separated[1] = letter;
        lastLetter = this.combine(separated[0], separated[1], separated[2]);
      } else if (separated[2] === '' && (separated[1] === 'ㅗ' || separated[1] === 'ㅜ' || separated[1] === 'ㅡ')) {
        let recombinable = false;
        switch (true) {
          case separated[1] === 'ㅗ' && letter === 'ㅏ':
            separated[1] = 'ㅘ';
            recombinable = true;
            break;
          case separated[1] === 'ㅗ' && letter === 'ㅐ':
            separated[1] = 'ㅙ';
            recombinable = true;
            break;
          case separated[1] === 'ㅗ' && letter === 'ㅣ':
            separated[1] = 'ㅚ';
            recombinable = true;
            break;
          case separated[1] === 'ㅜ' && letter === 'ㅓ':
            separated[1] = 'ㅘ';
            recombinable = true;
            break;
          case separated[1] === 'ㅜ' && letter === 'ㅔ':
            separated[1] = 'ㅞ';
            recombinable = true;
            break;
          case separated[1] === 'ㅜ' && letter === 'ㅣ':
            separated[1] = 'ㅟ';
            recombinable = true;
            break;
          case separated[1] === 'ㅡ' && letter === 'ㅣ':
            separated[1] = 'ㅢ';
            recombinable = true;
            break;
          default:
            lastValue += lastLetter;
            lastLetter = letter;
        }
        if (recombinable) {
          lastLetter = this.combine(separated[0], separated[1], separated[2]);
        }
      } else if (separated[2] !== '') {
          if (
          separated[2] === 'ㄳ' ||
          separated[2] === 'ㄵ' ||
          separated[2] === 'ㄶ' ||
          separated[2] === 'ㄺ' ||
          separated[2] === 'ㄻ' ||
          separated[2] === 'ㄼ' ||
          separated[2] === 'ㄽ' ||
          separated[2] === 'ㄾ' ||
          separated[2] === 'ㄿ' ||
          separated[2] === 'ㅀ' ||
          separated[2] === 'ㅄ'
        ) {
          let letter1Sep, letter2Sep;
          switch (separated[2]) {
            case 'ㄳ':
              letter1Sep = 'ㄱ'; letter2Sep = 'ㅅ';
              break;
            case 'ㄵ':
              letter1Sep = 'ㄴ'; letter2Sep = 'ㅈ';
              break;
            case 'ㄶ':
              letter1Sep = 'ㄴ'; letter2Sep = 'ㅎ';
              break;
            case 'ㄺ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㄱ';
              break;
            case 'ㄻ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㅁ';
              break;
            case 'ㄼ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㅂ';
              break;
            case 'ㄽ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㅅ';
              break;
            case 'ㄾ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㅌ';
              break;
            case 'ㄿ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㅍ';
              break;
            case 'ㅀ':
              letter1Sep = 'ㄹ'; letter2Sep = 'ㅎ';
              break;
            case 'ㅄ':
              letter1Sep = 'ㅂ'; letter2Sep = 'ㅅ';
              break;
          }
          const newCombination_letter1 = this.combine(separated[0], separated[1], letter1Sep);
          const newCombination_letter2 = this.combine(letter2Sep, letter, '');
          lastValue += newCombination_letter1;
          lastLetter = newCombination_letter2;
        } else {
          const newCombination_letter1 = this.combine(separated[0], separated[1], '');
          const newCombination_letter2 = this.combine(separated[2], letter, '');
          lastValue += newCombination_letter1;
          lastLetter = newCombination_letter2;
        }
      } else {
        lastValue += lastLetter;
        lastLetter = letter;
      }
    } else {
      if (lastLetter === '' || separated[1] === '' || this.letterMap.checkIfKorean(lastLetter)) {
        lastValue += lastLetter;
        lastLetter = letter;
      } else if (
        separated[2] === 'ㄱ' ||
        separated[2] === 'ㄴ' ||
        separated[2] === 'ㄹ' ||
        separated[2] === 'ㅂ'
      ) {
        let recombinable = false;
        switch (true) {
          case separated[2] === 'ㄱ' && letter === 'ㅅ':
            separated[2] = 'ㄳ';
            recombinable = true;
            break;
          case separated[2] === 'ㄴ' && letter === 'ㅈ':
            separated[2] = 'ㄵ';
            recombinable = true;
            break;
          case separated[2] === 'ㄴ' && letter === 'ㅎ':
            separated[2] = 'ㄶ';
            recombinable = true;
            break;
          case separated[2] === 'ㄹ':
            switch (letter) {
              case 'ㄱ':
                separated[2] = 'ㄺ';
                recombinable = true;
                break;
              case 'ㅁ':
                separated[2] = 'ㄻ';
                recombinable = true;
                break;
              case 'ㅂ':
                separated[2] = 'ㄼ';
                recombinable = true;
                break;
              case 'ㅅ':
                separated[2] = 'ㄽ';
                recombinable = true;
                break;
              case 'ㅌ':
                separated[2] = 'ㄾ';
                recombinable = true;
                break;
              case 'ㅍ':
                separated[2] = 'ㄿ';
                recombinable = true;
                break;
              case 'ㅎ':
                separated[2] = 'ㅀ';
                recombinable = true;
                break;
              default:
                lastValue += lastLetter;
                lastLetter = letter;
            }
            break;
          case separated[2] === 'ㅂ' && letter === 'ㅅ':
            separated[2] = 'ㅄ';
            recombinable = true;
            break;
          default:
            lastValue += lastLetter;
            lastLetter = letter;
        }
        if (recombinable) {
          lastLetter = this.combine(separated[0], separated[1], separated[2]);
        }
      } else {
        if (this.letterMap.final_consoMap.includes(letter)) {
          if (separated[2] === '') {
            separated[2] = letter;
            lastLetter = this.combine(separated[0], separated[1], separated[2]);
          } else {
            lastValue += lastLetter;
            lastLetter = letter;
          }
        } else {
          lastValue += lastLetter;
          lastLetter = letter;
        }
      }
    }
    return lastValue + lastLetter;
  }
  this.removeLetter = function (currentValue) {
    let lastValue = currentValue.slice(0, currentValue.length - 1);
    let lastLetter = currentValue[currentValue.length - 1];
    if (this.deleteSyllable) {
      lastLetter = '';
    } else {
      const separated = this.separate(lastLetter);
      if (separated[2] !== '') {
        lastLetter = this.combine(separated[0], separated[1], '');
      } else if (separated[1] !== '') {
        lastLetter = separated[0];
      } else if (separated[0] !== '') {
        lastLetter = '';
        this.deleteSyllable = true;
      }
    }
    return lastValue + lastLetter;
  }
  this.inputHandler = function (letter) {
    let oldValue = this.value.substring(0, this.selectionStart);
    const nextValue = this.value.substring(this.selectionEnd);
    let updatedValue;
    if (this.letterMap.checkIfKorean(letter)) {
      updatedValue = this.insertLetter(oldValue, letter);
      this.deleteSyllable = false;
    } else {
      updatedValue = oldValue + letter;
      this.deleteSyllable = true;
    }
    this.value = updatedValue + nextValue;
    this.selectionStart = this.selectionEnd = this.selectionStart + (updatedValue.length - oldValue.length);
    this.update();
    this.inputElement.dispatchEvent(new Event('input'));
  }
  this.backspace = function () {
    let oldValue = this.value.substring(0, this.selectionStart);
    const nextValue = this.value.substring(this.selectionEnd);
    let updatedValue;
    if (this.selectionStart === this.selectionEnd) {
      updatedValue = this.removeLetter(oldValue);
    } else {
      updatedValue = oldValue;
      this.deleteSyllable = true;
    }
    this.value = updatedValue + nextValue;
    this.selectionStart = this.selectionEnd = this.selectionStart + (updatedValue.length - oldValue.length);
    this.update();
    this.inputElement.dispatchEvent(new Event('input'));
  }
}
