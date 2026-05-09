class Codearea extends HTMLElement {
    constructor() {
        super();
        this.textarea = document.createElement('textarea');
        this.appendChild(this.textarea);
        this._value = '';
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.textarea.addEventListener('keydown', (event) => {
            this.inputHandler();
            if (event.key === 'Enter') {
                this.handleEnter(event);
                this.updateState();
            } else if (event.key === 'Tab') {
                if (!event.shiftKey) {
                    if (this.selectionStart === this.selectionEnd) this.insertTab(event)
                    else this.indent(event);
                } else this.outdent(event);
                this.updateState();
            }
        });
        this.textarea.style.fontFamily = 'monospace';
        this.textarea.style.width = '350px';
        this.textarea.style.height = '250px';

        this.updateState();
    }
    get value() {
        return this._value;
    }
    set value(valuePar) {
        this._value = valuePar;
        this.updateState();
    }
    getLineNumber(index) {
        return this._value.slice(0, index).split('\n').length - 1;
    }
    getLastSpaces(index) {
        const lineNumber = this.getLineNumber(index);
        const content = this._value.split('\n')[lineNumber];
        return content.match(/^\s*/g);
    }
    insertText(text) {
        const start = this.selectionStart,
            end = this.selectionEnd,
            value = this._value;
        
        this._value = value.substring(0, start) + text + value.substring(end);
        this.selectionStart = this.selectionEnd = start + text.length;
    }
    insertTab(event) {
        event.preventDefault();
        this.insertText('  ');
    }
    handleEnter(event) {
        event.preventDefault();
        const spaces = this.getLastSpaces(this.selectionStart);
        this.insertText('\n' + spaces);
    }
    indent(event) {
        event.preventDefault();
        const start = Math.min(this.selectionStart, this.selectionEnd);
        const end = Math.max(this.selectionStart, this.selectionEnd);
        const lineNumber_start = this.getLineNumber(start);
        const lineNumber_end = this.getLineNumber(end);

        const splitted = this._value.split('\n');
        for (let index = lineNumber_start; index <= lineNumber_end; index++) {
            splitted[index] = '  ' + splitted[index];
        }
        const joined = splitted.join('\n');

        const original = this._value;
        this._value = joined;
        this.selectionEnd += joined.length - original.length;
    }
    outdent(event) {
        event.preventDefault();
        const start = Math.min(this.selectionStart, this.selectionEnd);
        const end = Math.max(this.selectionStart, this.selectionEnd);
        const lineNumber_start = this.getLineNumber(start);
        const lineNumber_end = this.getLineNumber(end);

        const splitted = this._value.split('\n');
        for (let index = lineNumber_start; index <= lineNumber_end; index++) {
            splitted[index] = splitted[index].replace(/^\s{2}/, '');
        }
        const joined = splitted.join('\n');

        const original = this._value;
        this._value = joined;
        this.selectionEnd += joined.length - original.length;
    }
    inputHandler() {
        this._value = this.textarea.value;
        this.selectionStart = this.textarea.selectionStart;
        this.selectionEnd = this.textarea.selectionEnd;
    }
    updateState() {
        this.textarea.value = this._value;
        this.textarea.selectionStart = this.selectionStart;
        this.textarea.selectionEnd = this.selectionEnd;
    }
}

customElements.define('code-area', Codearea);

function convertTextareaToCodearea(textarea) {
    const codearea = document.createElement('code-area');
    for (const attribute in textarea) {
        codearea[attribute] = textarea[attribute];
    }
    textarea.parentElement.replaceChild(codearea, textarea);
}
