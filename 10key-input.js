
const allLetters = [];
for (let letterIndex = 0xAC00; letterIndex < 0xAC00 + 11172; letterIndex++) {
    allLetters.push(String.fromCharCode(letterIndex));
}

const strokeToIndex1 = {
    "4": 0, "444": 1, "5": 2, "6": 3, "666": 4,
    "55": 5, "00": 6, "1": 7, "111": 8, "2": 9,
    "222": 10, "0": 11, "3": 12, "333": 13, "33": 14,
    "44": 15, "66": 16, "11": 17, "22": 18
};
const indexToStroke1 = '4,444,5,6,666,55,00,1,111,2,222,0,3,333,33,44,66,11,22'.split(',');
const strokeToIndex2 = {
    "78": 0, "787": 1, "788": 2, "7887": 3, "87": 4,
    "877": 5, "887": 6, "8877":7, "89": 8, "8978": 9,
    "89787": 10, "897": 11, "889": 12, "98": 13, "9887": 14,
    "98877": 15, "987": 16, "988": 17, "9": 18, "97": 19,
    "7": 20
}
const indexToStroke2 = '78,787,788,7887,87,877,887,8877,89,8978,89787,897,889,98,9887,98877,987,988,9,97,7'.split(',');
const strokeToIndex3 = {
    "": 0, "4": 1, "444": 2, "42": 3, "5": 4,
    "53": 5, "522": 6, "6": 7, "55": 8, "554": 9,
    "5500": 10, "551": 11, "552": 12, "5566": 13, "5511": 14,
    "5522": 15, "00": 16, "1": 17, "12": 18, "2": 19,
    "222": 20, "0": 21, "3": 22, "33": 23, "44": 24,
    "66": 25, "11": 26, "22": 27
}
const indexToStroke3 = ',4,444,42,5,53,522,6,55,554,5500,551,552,5566,5511,5522,00,1,12,2,222,0,3,33,44,66,11,22'.split(',');

const indexToLetter1 = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
const indexToLetter2 = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
const indexToLetter3 = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.split('')];

/**
 * @param {{letter1: string, letter2: string, letter3: string}} letter
 * @returns {string}
 */
function combine(letter={letter1:'',letter2:'',letter3:''}) {
    let {letter1, letter2, letter3} = letter;
    if (!(letter1 || letter2 || letter3)) {
        return '';
    } else if (letter1 && !(letter2 || letter3)) {
        return indexToLetter1[strokeToIndex1[letter1]];
    } else if (letter2 && !(letter1 || letter3)) {
        if (strokeToIndex2[letter2] != undefined) {
            return indexToLetter2[strokeToIndex2[letter2]];
        } else {
            return letter2;
        }
    } else {
        if (strokeToIndex3[letter3] != undefined) {
            let strokeToIndex2Result = strokeToIndex2[letter2];
            if (strokeToIndex2Result != undefined) {
                const letterIndex = strokeToIndex1[letter1] * 588 + strokeToIndex2Result * 28 + strokeToIndex3[letter3];
                return allLetters[letterIndex];
            } else {
                strokeToIndex2Result = letter2;
                return indexToLetter1[strokeToIndex1[letter1]] + strokeToIndex2Result + indexToLetter3[strokeToIndex3[letter3]];
            }
        } else {
            let lastLetter = '';
            let letterResult = false;
            for (let stroke of '456123') {
                letterResult ||= letter3.endsWith(stroke.repeat(2));
            }
            if (letterResult) {
                letterResult = false;
                for (let stroke of '46123') {
                    letterResult ||= letter3.endsWith(stroke.repeat(3));
                }
                if (letterResult) {
                    lastLetter = letter3.substring(letter3.length - 3);
                    letter3 = letter3.substring(0, letter3.length - 3);
                } else {
                    lastLetter = letter3.substring(letter3.length - 2);
                    letter3 = letter3.substring(0, letter3.length - 2);
                }
            } else {
                lastLetter = letter3.at(-1);
                letter3 = letter3.substring(0, letter3.length - 1);
            }
            let strokeToIndex2Result = strokeToIndex2[letter2];
            if (strokeToIndex2Result != undefined) {
                const letterIndex = strokeToIndex1[letter1] * 588 + strokeToIndex2Result * 28 + strokeToIndex3[letter3];
                return allLetters[letterIndex] + indexToLetter3[strokeToIndex3[lastLetter]];
            } else {
                strokeToIndex2Result = letter2;
                return indexToLetter1[strokeToIndex1[letter1]] + strokeToIndex2Result + indexToLetter3[strokeToIndex3[letter3]] + indexToLetter3[strokeToIndex3[lastLetter]];
            }
        }
    }
}

/**
 * @param {string} letter
 * @returns {{letter1: string, letter2: string, letter3: string}}
 */
function uncombine(letter) {
    if (letter == '') {
        return {letter1: '', letter2: '', letter3: ''};
    }
    if (indexToLetter1.includes(letter)) {
        return {letter1: indexToStroke1[indexToLetter1.indexOf(letter)], letter2: '', letter3: ''};
    }
    if (indexToLetter2.includes(letter) || letter == '8' || letter == '88') {
        if (letter == '8' || letter == '88') {
            return {letter1: '', letter2: letter, letter3: ''};
        } else {
            return {letter1: '', letter2: indexToStroke2[indexToLetter2.indexOf(letter)], letter3: ''};
        }
    }
    if (letter.match(/\d*/gv)[1] == '88') {
        const letter3 = letter.split('88')[1].split('').map((letter) => indexToStroke3[indexToLetter3.indexOf(letter)]).join('');
        const letter2 = '88';
        const letter1 = indexToStroke1[indexToLetter1.indexOf(letter.split('88')[0])];
        return {letter1: letter1, letter2: letter2, letter3: letter3};
    } else if (letter.match(/\d*/gv)[1] == '8') {
        const letter3 = letter.split('8')[1].split('').map((letter) => indexToStroke3[indexToLetter3.indexOf(letter)]).join('');
        const letter2 = '8';
        const letter1 = indexToStroke1[indexToLetter1.indexOf(letter.split('8')[0])];
        return {letter1: letter1, letter2: letter2, letter3: letter3};
    } else {
        let letterIndex = allLetters.indexOf(letter[0]);
        let finalLetterIndex;
        if (letter.length > 1) {
            finalLetterIndex = indexToStroke3[indexToLetter3.indexOf(letter[1])];
        } else {
            finalLetterIndex = '';
        }
        
        const letter3 = indexToStroke3[letterIndex % 28] + finalLetterIndex;
        letterIndex = Math.floor(letterIndex / 28);
        const letter2 = indexToStroke2[letterIndex % 21];
        letterIndex = Math.floor(letterIndex / 21);
        const letter1 = indexToStroke1[letterIndex];
        return {letter1: letter1, letter2: letter2, letter3: letter3};
    }
}

/**
 * @param {string} final 
 * @returns {Array<string>}
 */
function uncombineFinal(final) {
    if (final == '42') return ['4','2'];
    if (final == '53') return ['5','3'];
    if (final == '522') return ['5','22'];
    if (final == '554') return ['55','24'];
    if (final == '5500') return ['55','00'];
    if (final == '551') return ['55','1'];
    if (final == '552') return ['55','2'];
    if (final == '5566') return ['55','66'];
    if (final == '5511') return ['55','11'];
    if (final == '5522') return ['55','22'];
    if (final == '12') return ['1','2'];
    if (final == '52') return ['5', '2'];
    if (final == '550') return ['55', '0'];
    if (final == '556') return ['55', '6'];
    return null;
}

/**
 * @param {string} stroke
 * @param {string} key
 */
function addStrokeToValue(key, stroke) {
    const currentLetter = currentLetters[key];
    const currentStruct = uncombine(currentLetter);
    const currentFinal = uncombineFinal(currentStruct.letter3);
    if (stroke == 'Backspace') {
        currentLeftValues[key] += currentLetter;
        currentLetters[key] = '';
        const currentValue = currentLeftValues[key];
        currentLeftValues[key] = currentValue.substring(0, currentValue.length - 1);
    } else if (stroke == '7' || stroke == '8' || stroke == '9') {
        let nextStruct = currentStruct;
        if (currentStruct.letter3 != '') {
            if (currentFinal) {
                currentStruct.letter3 = currentFinal[0];
                currentLeftValues[key] += combine(currentStruct);
                nextStruct = {letter1: currentFinal[1], letter2: '', letter3: ''};
            } else {
                const lastLetter3 = currentStruct.letter3;
                currentStruct.letter3 = '';
                currentLeftValues[key] += combine(currentStruct);
                nextStruct = {letter1: lastLetter3, letter2: '', letter3: ''};
            }
        }
        if (nextStruct.letter2 == '' || nextStruct.letter2 == '8' || strokeToIndex2[nextStruct.letter2 + stroke] != undefined) {
            nextStruct.letter2 += stroke;
            currentLetters[key] = combine(nextStruct);
        }
    } else if (stroke == '.') {
        currentLeftValues[key] += currentLetter != '' ? currentLetter : ' ';
        currentLetters[key] = '';
    } else {
        if (currentStruct.letter2 == '') {
            if (strokeToIndex1[currentStruct.letter1 + stroke] != undefined) {
                currentStruct.letter1 += stroke;
                currentLetters[key] = combine(currentStruct);
            } else {
                currentLeftValues[key] += currentLetter;
                currentLetters[key] = combine({letter1: stroke, letter2: '', letter3: ''});
            }
        } else {
            if (currentStruct.letter1 != '' && (strokeToIndex3[currentStruct.letter3 + stroke] != undefined || ['52', '550', '556'].includes(currentStruct.letter3 + stroke))) {
                currentStruct.letter3 += stroke;
                currentLetters[key] = combine(currentStruct);
            } else {
                currentLeftValues[key] += currentLetter;
                currentLetters[key] = combine({letter1: stroke, letter2: '', letter3: ''});
            }
        }
    }
}

let currentLeftValues = {};
let currentRightValues = {};
let currentLetters = {};
let currentLanguage = {};
function getDisplayResult(key) {
    return currentLeftValues[key] + currentLetters[key] + '⏐' + currentRightValues[key] + (currentLanguage[key] ? ' (한)' : ' (영)');
}
function getInputResult(key) {
    return currentLeftValues[key] + currentLetters[key] + currentRightValues[key];
}

function register10KeyInput(key) {
    currentLeftValues = {...currentLeftValues, [key]: ''};
    currentRightValues = {...currentRightValues, [key]: ''};
    currentLetters = {...currentLetters, [key]: ''};
    currentLanguage = {...currentLanguage, [key]: true};
    document.getElementById(key).addEventListener('keydown', (event) => handleKeyDown(event, key));
}

function handleKeyDown(event, key) {
    const inputArea = document.getElementById(key);
    if (event.key == 'Space' && event.shiftKey) {
        event.preventDefault();
        const currentLetter = currentLetters[key];
        currentLeftValues[key] += currentLetter;
        currentLetters[key] = '';
        currentLanguage[key] = !currentLanguage[key];
        inputArea.value = getDisplayResult(key);
        inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
        return;
    }
    if (event.key == 'Delete') {
        event.preventDefault();
        currentLeftValues[key] = '';
        currentRightValues[key] = '';
        currentLetters[key] = '';
        inputArea.value = getDisplayResult(key);
        inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
        return;
    }
    if (event.key == 'ArrowLeft') {
        event.preventDefault();
        const currentLetter = currentLetters[key];
        currentLeftValues[key] += currentLetter;
        currentLetters[key] = '';
        currentRightValues[key] = (currentLeftValues[key].at(-1) || '') + currentRightValues[key];
        currentLeftValues[key] = currentLeftValues[key].substring(0, currentLeftValues[key].length - 1);
        inputArea.value = getDisplayResult(key);
        inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
        return;
    }
    if (event.key == 'ArrowRight') {
        event.preventDefault();
        const currentLetter = currentLetters[key];
        currentLeftValues[key] += currentLetter;
        currentLetters[key] = '';
        currentLeftValues[key] = currentLeftValues[key] + (currentRightValues[key][0] || '');
        currentRightValues[key] = currentRightValues[key].substring(1);
        inputArea.value = getDisplayResult(key);
        inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
        return;
    }
    if (currentLanguage[key]) {
        if (('0123456789.'.split('').includes(event.key) || event.key == 'Backspace')) {
            event.preventDefault();
            addStrokeToValue(key, event.key);
            inputArea.value = getDisplayResult(key);
            inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
                return;
        }
    } else {
        if (event.key.length == 1) {
            event.preventDefault();
            currentLeftValues[key] += event.key;
            inputArea.value = getDisplayResult(key);
            inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
            return;
        } else if (event.key == 'Space') {
            event.preventDefault();
            currentLeftValues[key] += event.key;
            inputArea.value = getDisplayResult(key);
            inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
            return;
        } else if (event.key == 'Backspace') {
            event.preventDefault();
            const currentValue = currentLeftValues[key];
            currentLeftValues[key] = currentValue.substring(0, currentValue.length - 1);
            inputArea.value = getDisplayResult(key);
            inputArea.selectionStart = inputArea.selectionEnd = currentLeftValues[key].length;
            return;
        }
    }
}
