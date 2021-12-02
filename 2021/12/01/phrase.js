import { s } from './sketch.js';

export setPhrase = (fonts, params) => {
	// calc font total width
	const phrase = {};
	const fontWidths = fonts.map(font => font.bounds.w);
	phrase.width = fontWidths.map((width, index) => {
		const prevWidths = fontWidths.slice(0, index + 1); // + 1でいいのか？
		return prevWidths.reduce((pre, acc) => pre + acc);
	});
	return phrase;
}