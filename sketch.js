let params;
const canvasDiv = document.getElementById('sketch'); 

const testSetup = () => {
}

const thisSetup = s => {
	
	params = {
		width: canvasDiv.clientWidth,
		height: canvasDiv.clientWidth*0.2,
		scrollTop: 0,
		scrollmax: 200,
	};
	s.createCanvas(params.width, params.height);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	/* frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.width, params.height);
	s.pop(); */
	// update
	params.scrollTop = canvasDiv.scrollTop || document.body.scrollTop || window.pageYOffset;
	const multRate = (params.scrollmax - params.scrollTop) / params.scrollmax;
	// font
	s.textSize(34);
	s.textFont('Helvetica Neue');
	s.textAlign(s.LEFT, s.CENTER);
	s.scale(1, multRate);
	s.fill(255 - 255 * multRate);
	s.text('Sketch List', 0, params.height/2);
	// testDraw();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
