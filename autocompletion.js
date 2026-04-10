const policy = trustedTypes.createPolicy('policy', {createHTML: html => html});

let words;
async function fetchWords() {
    const response = await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/refs/heads/master/google-10000-english-no-swears.txt');
    const textResult = await response.text();
    words = textResult.split('\n').map(word => word.toLowerCase()).filter(x => x.match(/^[a-z]/));
    return new Promise(resolve => resolve());
}

fetchWords();

class TextEditorElement extends HTMLElement {
    constructor() {
        super();

        this.textEditor = document.createElement('textarea');
        this.buttons = document.createElement('div');

        this.textEditor.addEventListener('click', () => this.replaceButtons());
        this.textEditor.addEventListener('keyup', () => this.replaceButtons());

        this.append(this.textEditor, this.buttons);
    }

    getValue() {
        return this.textEditor.value;
    }
    setValue(text) {
        this.textEditor.value = text;
    }
    
    getLastWord() {
        const text = this.textEditor.value;
        const selLength = this.textEditor.selectionEnd;
        const l = text.slice(0, selLength).split(/[^A-Za-z]/);
        const wordNumber = l.length - 1;
        const word = l[wordNumber];
        return word;
    }

    suggestedWords(incomp) {
        let index = 1;
        return words.filter(word => {
            if (word.startsWith(incomp) && index <= 10) {
                index++;
                return true;
            }
            return false;
        });
    }

    replaceButtons() {
        this.buttons.innerHTML = policy.createHTML('');
        const lastWord = this.getLastWord();
        const wordButtons = this.suggestedWords(lastWord);
        Array.from(this.buttons.children).forEach(wordButton => {
            this.buttons.removeChild(wordButton);
        });
        wordButtons.forEach((wordText, index) => {
            const wordButtonElement = document.createElement('button');
            wordButtonElement.addEventListener('click', () => this.insertWord(index));
            wordButtonElement.innerText = wordText;
            this.buttons.appendChild(wordButtonElement);
        });
        this.textEditor.dispatchEvent(new Event('input', { bubbles: true }));
    }

    insertWord(index) {
        const lastWord = this.getLastWord();
        const wordButtons = this.suggestedWords(lastWord);
        this.changeTo(wordButtons[index]);
    }

    changeTo(w) {
        const text = this.textEditor.value;
        const selLength = this.textEditor.selectionEnd;
        const l = text.slice(0, selLength).split(/(\s)/);
        const wordNumber = l.length - 1;
        const word = l[wordNumber];
        this.textEditor.value = (x => {
            x[wordNumber] = w;
            return x.join('');
        })(text.split(/(\s)/));
        this.textEditor.focus();
        this.textEditor.selectionStart = this.textEditor.selectionEnd = selLength - word.length + w.length;
        this.textEditor.dispatchEvent(new Event('input', { bubbles: true }));
        this.replaceButtons();
    }
}
        
customElements.define('text-editor', TextEditorElement);
