const creditTemplate = () => {
	const twitter = '<a href="https://mobile.twitter.com/ocello3" target="_blank" rel="noopener noreferer" class="uk-icon-link" uk-icon="twitter"></a>';
	const github = '<a href="https://github.com/ocello3/sketch" target="_blank" rel="noopener noreferer" class="uk-icon-link" uk-icon="github"></a>';
	const p5js = '<a class="uk-link-text" href="https://p5js.org/">p5.js</a>';
	const tonejs = '<a class="uk-link-text" href="https://tonejs.github.io/">Tone.js</a>';
	const tweakpane = '<a class="uk-link-text" href="https://cocopon.github.io/tweakpane/">Tweakpane</a>';
	const snddev = '<a class="uk-link-text" href="https://snd.dev/">snd.dev</a>';
	return `
	<dl class="uk-description-list">
		<dt>about</dt>
		<dd>sketch archives by ocello3.</dd>
		<dt>credits</dt>
		<dd>${p5js}, ${tonejs}, ${tweakpane}, ${snddev}</dd>
		</dl>
	`;
}

export const renderCredit = (id) => {
	const text = creditTemplate();
	document.getElementById(id).innerHTML = text;
}
