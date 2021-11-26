export const setParams = () => {
	const canvasDiv = document.getElementById('sketch');
	return {
		num: 20,
		size: canvasDiv.clientWidth,
		frameCount: 0,
		noiseZ_min: 0.2,
		noiseZ_max: 1,
		speedRate: 0.01,
		dist_max: canvasDiv.clientWidth/2,
	}
}

export const updateParams = (params) => {
	params.frameCount += 1;
}

export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addInput(params, 'noiseZ_max', {
		min: 0, max: 5, step: 0.1
	});
}