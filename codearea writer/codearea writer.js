const indentInsertionElem = document.getElementById("indentInsertion");
const followIndentElem = document.getElementById("followIndent");
const followMultilineIndentElem = document.getElementById("followMultilineIndent");
const indentSelectionElem = document.getElementById("indentSelection");
const outdentSelectionElem = document.getElementById("outdentSelection");
let currentArea = document.createElement("textarea");

Array.from(document.querySelectorAll("[data-behavior=\"code\"]")).forEach((area) => {
	area.addEventListener("click", () => currentArea = area);
})

const getLineNumber = (paragraphsString, caretPosition) => paragraphsString.substring(0, caretPosition).split("\n").length - 1;

function insertIndentString(paragraphsString, caretPosition1, caretPosition2) {
	let caretPosition = caretPosition1;
	const leftContent = paragraphsString.substring(0, caretPosition);
	const rightContent = paragraphsString.substring(caretPosition);
	paragraphsString = leftContent + "  " + rightContent;
	caretPosition += 2;
	return [ paragraphsString, caretPosition, caretPosition ];
}
function followIndentString(paragraphsString, caretPosition1, caretPosition2) {
	let caretPosition = caretPosition1;
	const lines = paragraphsString.split("\n");
	const lineNumber = getLineNumber(paragraphsString, caretPosition);
	let caretLine = lines[lineNumber];
	let previousLine = lineNumber - 1 >= 0 ? lines[lineNumber - 1] : null;
	if (previousLine) {
		const spaceRegex = /^\s*/g;
		if (spaceRegex.test(previousLine)) {
			const match = previousLine.match(spaceRegex)[0];
			if (!(caretLine.startsWith(match))) {
				caretLine = match + caretLine;
				caretPosition += match.length;
			}
		}
	}
	lines[lineNumber] = caretLine;
	paragraphsString = lines.join("\n");
	return [ paragraphsString, caretPosition, caretPosition ];
}
function followMultilineIndentString(paragraphsString, caretPosition1, caretPosition2) {
	const minValue = Math.min(caretPosition1, caretPosition2);
	const maxValue = Math.max(caretPosition1, caretPosition2);
	caretPosition1 = minValue;
	caretPosition2 = maxValue;

	const lines = paragraphsString.split("\n");
	const caretPosition1LineNumber = getLineNumber(paragraphsString, caretPosition1);
	const caretPosition2LineNumber = getLineNumber(paragraphsString, caretPosition2);
	const previousLine = caretPosition1LineNumber - 1 >= 0 ? lines[caretPosition1LineNumber - 1] : null;
	let match = "";
	if (previousLine) {
		const spaceRegex = /^\s*/g;
		if (spaceRegex.test(previousLine)) {
			match = previousLine.match(spaceRegex)[0];
		}
	}
	for (let lineNumber = caretPosition1LineNumber; lineNumber <= caretPosition2LineNumber; lineNumber++) {
		let caretLine = lines[lineNumber];
		if (!(caretLine.startsWith(match))) {
			caretLine = match + caretLine;
			lines[lineNumber] = caretLine;
			if (lineNumber == caretPosition1LineNumber) {
				caretPosition1 += match.length;
			}
			caretPosition2 += match.length;
		}
	}
	paragraphsString = lines.join("\n");
	return [ paragraphsString, caretPosition1, caretPosition2 ];
}
function indentSelectionString(paragraphsString, caretPosition1, caretPosition2) {
	const minValue = Math.min(caretPosition1, caretPosition2);
	const maxValue = Math.max(caretPosition1, caretPosition2);
	caretPosition1 = minValue;
	caretPosition2 = maxValue;

	const lines = paragraphsString.split("\n");
	const caretPosition1LineNumber = getLineNumber(paragraphsString, caretPosition1);
	const caretPosition2LineNumber = getLineNumber(paragraphsString, caretPosition2);
	for (let lineNumber = caretPosition1LineNumber; lineNumber <= caretPosition2LineNumber; lineNumber++) {
		let caretLine = lines[lineNumber];
		caretLine = "  " + caretLine;
		lines[lineNumber] = caretLine;
		caretPosition2 += 2;
	}
	paragraphsString = lines.join("\n");
	return [ paragraphsString, caretPosition1, caretPosition2 ];
}
function outdentSelectionString(paragraphsString, caretPosition1, caretPosition2) {
	let minValue = Math.min(caretPosition1, caretPosition2);
	let maxValue = Math.max(caretPosition1, caretPosition2);
	caretPosition1 = minValue;
	caretPosition2 = maxValue;

	const lines = paragraphsString.split("\n");
	const caretPosition1LineNumber = getLineNumber(paragraphsString, caretPosition1);
	const caretPosition2LineNumber = getLineNumber(paragraphsString, caretPosition2);
	for (let lineNumber = caretPosition1LineNumber; lineNumber <= caretPosition2LineNumber; lineNumber++) {
		let caretLine = lines[lineNumber];
		if (caretLine.startsWith("  ")) {
			caretLine = caretLine.substring(2);
			lines[lineNumber] = caretLine;
			caretPosition2 -= 2;
		}
	}
	paragraphsString = lines.join("\n");

	minValue = Math.min(caretPosition1, caretPosition2);
	maxValue = Math.max(caretPosition1, caretPosition2);
	caretPosition1 = minValue;
	caretPosition2 = maxValue;
	return [ paragraphsString, caretPosition1, caretPosition2 ];
}

function insertIndent() {
	const activeElement = currentArea;
	activeElement.focus();
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ];
	[ paragraphsString, caretPosition1, caretPosition2 ] = insertIndentString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}
function followIndent() {
	const activeElement = currentArea;
	activeElement.focus();
	let [ paragraphsString, caretPosition, caretPosition2 ] = [ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ];
	[ paragraphsString, caretPosition1, caretPosition2 ] = followIndentString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}
function followMultilineIndent() {
	const activeElement = currentArea;
	activeElement.focus();
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ];
	[ paragraphsString, caretPosition1, caretPosition2 ] = followMultilineIndentString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}
function indentSelection() {
	const activeElement = currentArea;
	activeElement.focus();
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ];
	[ paragraphsString, caretPosition1, caretPosition2 ] = indentSelectionString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}
function outdentSelection() {
	const activeElement = currentArea;
	activeElement.focus();
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ];
	[ paragraphsString, caretPosition1, caretPosition2 ] = outdentSelectionString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.selectionStart, activeElement.selectionEnd ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}

indentInsertionElem.addEventListener("click", insertIndent);
followIndentElem.addEventListener("click", followIndent);
followMultilineIndentElem.addEventListener("click", followMultilineIndent);
indentSelectionElem.addEventListener("click", indentSelection);

outdentSelectionElem.addEventListener("click", outdentSelection);
