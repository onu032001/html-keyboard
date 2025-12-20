const indentInsertionElem = document.getElementById("indentInsertion");
const followIndentElem = document.getElementById("followIndent");
const followMultilineIndentElem = document.getElementById("followMultilineIndent");
const indentSelectionElem = document.getElementById("indentSelection");
const outdentSelectionElem = document.getElementById("outdentSelection");

const getLineNumber = (paragraphsString, caretPosition) => paragraphsString.substring(0, caretPosition).split("\n").length - 1;

function insertIndentString(paragraphsString, caretPosition) {
	const leftContent = paragraphsString.substring(0, caretPosition);
	const rightContent = paragraphsString.substring(caretPosition);
	paragraphsString = leftContent + "  " + rightContent;
	caretPosition += 2;
	return { paragraphsString, caretPosition };
}
function followIndentString(paragraphsString, caretPosition) {
	const lines = paragraphsString.split("\n");
	const lineNumber = getLineNumber(paragraphsString, caretPosition);
	let caretLine = lines[linesNumber];
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
	lines[linesNumber] = caretLine;
	paragraphString = lines.join("\n");
	return { paragraphsString, caretPosition };
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
			caretPosition1 += match.length;
			caretPosition2 += match.length;
		}
	}
	paragraphString = lines.join("\n");
	return { paragraphsString, caretPosition1, caretPosition2 };
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
	return { paragraphsString, caretPosition1, caretPosition2 };
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
	return { paragraphsString, caretPosition1, caretPosition2 };
}

function insertIndent() {
	const activeElement = document.activeElement;
	let [ paragraphsString, caretPosition ] = [ activeElement.value, activeElement.start ];
	{ paragraphsString, caretPosition } = insertIndentString(paragraphsString, caretPosition);
	[ activeElement.value, activeElement.start ] = [ paragraphsString, caretPosition ];
}
function followIndent() {
	const activeElement = document.activeElement;
	let [ paragraphsString, caretPosition ] = [ activeElement.value, activeElement.start ];
	{ paragraphsString, caretPosition } = followIndentString(paragraphsString, caretPosition);
	[ activeElement.value, activeElement.start ] = [ paragraphsString, caretPosition ];
}
function followMultilineIndent() {
	const activeElement = document.activeElement;
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.start, activeElement.end ];
	{ paragraphsString, caretPosition1, caretPosition2 } = followMultilineIndentString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.start, activeElement.end ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}
function indentSelection() {
	const activeElement = document.activeElement;
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.start, activeElement.end ];
	{ paragraphsString, caretPosition1, caretPosition2 } = indentSelectionString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.start, activeElement.end ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}
function outdentSelection() {
	const activeElement = document.activeElement;
	let [ paragraphsString, caretPosition1, caretPosition2 ] = [ activeElement.value, activeElement.start, activeElement.end ];
	{ paragraphsString, caretPosition1, caretPosition2 } = outdentSelectionString(paragraphsString, caretPosition1, caretPosition2);
	[ activeElement.value, activeElement.start, activeElement.end ] = [ paragraphsString, caretPosition1, caretPosition2 ];
}

indentInsertionElem.addEventListener("click", insertIndent);
followIndentElem.addEventListener("click", followIndent);
followMultilineIndentElem.addEventListener("click", followMultilineIndent);
indentSelectionElem.addEventListener("click", indentSelection);
outdentSelectionElem.addEventListener("click", outdentSelection);