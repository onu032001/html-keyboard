const toButtons = layoutKeys => layoutKeys.split('');
const _1stAlphabetKeys = [toButtons('qwertyuiop'), toButtons('asdfghjkl\''), [...toButtons('zxcvbnm?'), 'back'], [',', '(space)', '.', 'abc', 'ABC', 'sym1', 'sym2']];
const _2ndAlphabetKeys = [toButtons('qwertyuiop'.toUpperCase()), toButtons('asdfghjkl"'.toUpperCase()), [...toButtons('zxcvbnm!'.toUpperCase()), 'back'], [';', '(space)', ':', 'abc', 'ABC', 'sym1', 'sym2']];
const _1stSymbolKeys = [toButtons('1234567890'), toButtons('!@#$¢&_-=+'), [...toButtons(';:()/\'"?'), 'back'], [',', '(space)', '.', 'abc', 'ABC', 'sym1', 'sym2']];
const _2ndSymbolKeys = [toButtons('1234567890'), toButtons('%[]{}<>^€¥'), [...toButtons('*`°×÷~|\\'), 'back'], [',', '(space)', '.', 'abc', 'ABC', 'sym1', 'sym2']];
const layoutKeyboards = [_1stAlphabetKeys, _2ndAlphabetKeys, _1stSymbolKeys, _2ndSymbolKeys];
const keyboardSwitch = ['abc', 'ABC', 'sym1', 'sym2'];

const insertTextKey = (layoutKey, thisParam) => {
    const text = getKeyValue(thisParam.layoutKeyboard, layoutKey.getAttribute('data-key-index'));
    if (text == 'back') {
        backSpaceAtInputArea(thisParam.inputArea);
        return;
    }
    if (keyboardSwitch.indexOf(text) >= 0) {
        thisParam.layoutNumber = keyboardSwitch.indexOf(text);
        thisParam.changeKeyboard();
        return;
    }
    insertAtInputArea(thisParam.inputArea, text);
    if (thisParam.layoutNumber == 1) {
        thisParam.layoutNumber = 0;
        thisParam.changeKeyboard();
    }
};

const insertAtInputArea = (container, text) => {
    let start = container.selectionStart;
    let end = container.selectionEnd;
    let start0 = Math.min(start, end);
    end = Math.max(start, end);
    start = start0;
    const value = container.value;

    container.value = value.substring(0, start) + text + value.substring(end);
    container.selectionStart = container.selectionEnd = start + text.length;
    container.focus();
    container.dispatchEvent(new Event('input'));
}
const backSpaceAtInputArea = (container) => {
    let start = container.selectionStart;
    let end = container.selectionEnd;
    let start0 = Math.min(start, end);
    end = Math.max(start, end);
    start = start0;
    const value = container.value;
    if (start == end) {
        container.value = value.substring(0, start - 1) + value.substring(end);
        container.selectionStart = container.selectionEnd = start - 1;
    } else {
        container.value = value.substring(0, start) + value.substring(end);
        container.selectionStart = container.selectionEnd = start;
    }
    container.focus();
    container.dispatchEvent(new Event('input'));
}

class HTMLKeyboard extends HTMLElement {
    constructor() {
        super();
        this.style.display = 'block';
    }
    loadVariables() {
        this.inputArea = document.getElementById(this.getAttribute('data-input-area'))
        this.layoutNumber = this.getAttribute('data-layout-number');
        this.layoutKeyboard = layoutKeyboards[this.layoutNumber];
        this.layoutKeys = [];
    }
    loadKeyboard() {
        let keyboardKeyIndex = 0;
        this.layoutKeyboard.forEach((layoutKeyRow, layoutIndex) => {
            layoutKeyRow.forEach(layoutKeyText => {
                const layoutKey = document.createElement('button');
                layoutKey.setAttribute('data-key-index', keyboardKeyIndex++);
                layoutKey.innerText = layoutKeyText;
                layoutKey.addEventListener('click', () => insertTextKey(layoutKey, this));
                this.append(layoutKey);
                this.layoutKeys.push(layoutKey);
            });
            const newLineBreak = document.createElement('br');
            this.append(newLineBreak);
        });
    }
    changeKeyboard() {
        this.layoutKeyboard = layoutKeyboards[this.layoutNumber];
        this.layoutKeys.forEach(layoutKey => {
            const keyIndex = layoutKey.getAttribute('data-key-index');
            layoutKey.innerText = getKeyValue(this.layoutKeyboard, keyIndex);
        });
    }
}

class FunctionStates {
    constructor() {}
}
const getKeyPath = (keyArray, path) => {
    for (let directory of path) {
        keyArray = keyArray[directory];
    }
    return keyArray;
}
const getKeyValue = (keyArray, keyIndex) => {
    const functionStates = new FunctionStates();
    let currentIndex = 0;
    let arrayIndex = 0;
    let path = [];
    let valueResult = keyArray;
    const loopedKey = () => {
        if (arrayIndex >= valueResult.length) {
            if (path.length == 0) {
                functionStates.return = true;
                return;
            }
            arrayIndex = path.pop();
            valueResult = getKeyPath(keyArray, path);
            arrayIndex++;
        }
        while (valueResult[arrayIndex] instanceof Array) {
            path.push(arrayIndex);
            valueResult = getKeyPath(keyArray, path);
            arrayIndex = 0;
            functionStates.continue = true;
            return;
        }
    }
    while (valueResult[arrayIndex] instanceof Array) {
        path.push(arrayIndex);
        valueResult = getKeyPath(keyArray, path);
        arrayIndex = 0;
    }
    while (currentIndex < keyIndex) {
        loopedKey();
        if (functionStates.return) {
            delete functionStates.return;
            return;
        }
        if (functionStates.continue) {
            delete functionStates.continue;
            continue;
        }
        currentIndex++;
        arrayIndex++;
        loopedKey();
        if (functionStates.return) {
            delete functionStates.return;
            return;
        }
        if (functionStates.continue) {
            delete functionStates.continue;
            continue;
        }
    }
    return valueResult[arrayIndex];
};

customElements.define('html-keyboard', HTMLKeyboard);
