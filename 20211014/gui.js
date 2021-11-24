export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addInput(params, 'num', {
		min: 0, max: 100, step: 1
	});
}