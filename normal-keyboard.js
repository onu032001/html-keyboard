class KeyboardRequirements {
    constructor() {
        this.toButtons = layoutKeys => layoutKeys.split('');
        this._1stAlphabetKeys = [this.toButtons('qwertyuiop'), this.toButtons('asdfghjkl\''), [...this.toButtons('zxcvbnm?'), 'back'], [',', '(space)', '.', 'abc', 'ABC', 'ABC Hold', 'sym1', 'sym2']];
        this._2ndAlphabetKeys = [this.toButtons('qwertyuiop'.toUpperCase()), this.toButtons('asdfghjkl"'.toUpperCase()), [...this.toButtons('zxcvbnm!'.toUpperCase()), 'back'], [';', '(space)', ':', 'abc', 'ABC', 'ABC Hold', 'sym1', 'sym2']];
        this._1stSymbolKeys = [this.toButtons('1234567890'), this.toButtons('!@#$¢&_-=+'), [...this.toButtons(';:()/\'"?'), 'back'], [',', '(space)', '.', 'abc', 'ABC', 'ABC Hold', 'sym1', 'sym2']];
        this._2ndSymbolKeys = [this.toButtons('1234567890'), this.toButtons('%[]{}<>^€¥'), [...this.toButtons('*`°×÷~|\\'), 'back'], [',', '(space)', '.', 'abc', 'ABC', 'ABC Hold', 'sym1', 'sym2']];
        this.layoutKeyboards = [this._1stAlphabetKeys, this._2ndAlphabetKeys, this._2ndAlphabetKeys, this._1stSymbolKeys, this._2ndSymbolKeys];
        this.keyboardSwitch = ['abc', 'ABC', 'ABC Hold', 'sym1', 'sym2'];
    }
    insertTextKey(layoutKey, thisParam) {
        const text = this.getKeyValue(thisParam.layoutKeyboard, layoutKey.getAttribute('data-key-index'));
        if (text == 'back') {
            this.backSpaceAtInputArea(thisParam.inputArea);
            return;
        }
        if (this.keyboardSwitch.indexOf(text) >= 0) {
            thisParam.layoutNumber = keyboardSwitch.indexOf(text);
            thisParam.changeKeyboard();
            return;
        }
        if (text == '(space)') {
            this.insertAtInputArea(thisParam.inputArea, ' ');
        } else {
            this.insertAtInputArea(thisParam.inputArea, text);
        }
        if (thisParam.layoutNumber == 1) {
            thisParam.layoutNumber = 0;
            thisParam.changeKeyboard();
        }
    }

    insertAtInputArea(container, text) {
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
    backSpaceAtInputArea(container) {
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

    getKeyPath(keyArray, path) {
        for (let directory of path) {
            keyArray = keyArray[directory];
        }
        return keyArray;
    }
    getKeyValue(keyArray, keyIndex) {
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
                valueResult = this.getKeyPath(keyArray, path);
                arrayIndex++;
            }
            while (valueResult[arrayIndex] instanceof Array) {
                path.push(arrayIndex);
                valueResult = this.getKeyPath(keyArray, path);
                arrayIndex = 0;
                functionStates.continue = true;
                return;
            }
        }
        while (valueResult[arrayIndex] instanceof Array) {
            path.push(arrayIndex);
            valueResult = this.getKeyPath(keyArray, path);
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
    }
}

const keyboardRequirements = new KeyboardRequirements();

class HTMLKeyboard extends HTMLElement {
    constructor() {
        super();
        this.style.display = 'block';
    }
    loadVariables() {
        this.inputArea = document.getElementById(this.getAttribute('data-input-area'))
        this.layoutNumber = this.getAttribute('data-layout-number');
        this.layoutKeyboard = keyboardRequirements.layoutKeyboards[this.layoutNumber];
        this.layoutKeys = [];
    }
    loadKeyboard() {
        let keyboardKeyIndex = 0;
        this.layoutKeyboard.forEach((layoutKeyRow, layoutIndex) => {
            layoutKeyRow.forEach(layoutKeyText => {
                const layoutKey = document.createElement('button');
                layoutKey.setAttribute('data-key-index', keyboardKeyIndex++);
                layoutKey.innerText = layoutKeyText;
                layoutKey.addEventListener('click', () => keyboardRequirements.insertTextKey(layoutKey, this));
                this.append(layoutKey);
                this.layoutKeys.push(layoutKey);
            });
            const newLineBreak = document.createElement('br');
            this.append(newLineBreak);
        });
    }
    changeKeyboard() {
        this.layoutKeyboard = keyboardRequirements.layoutKeyboards[this.layoutNumber];
        this.layoutKeys.forEach(layoutKey => {
            const keyIndex = layoutKey.getAttribute('data-key-index');
            layoutKey.innerText = keyboardRequirements.getKeyValue(this.layoutKeyboard, keyIndex);
        });
    }
}

class FunctionStates {
    constructor() {}
}

customElements.define('html-keyboard', HTMLKeyboard);
