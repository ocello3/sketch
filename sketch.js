let params;

const testSetup = () => {
}

const thisSetup = s => {
	const canvasDiv = document.getElementById('sketch');
	params = {
		width: canvasDiv.clientWidth,
		height: canvasDiv.clientWidth*0.2,
	};
	s.createCanvas(params.width, params.height);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	/* frame
	s.background(255);
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.width, params.height);
	s.pop(); */
	// font
	s.textSize(34);
	s.textFont('Helvetica Neue');
	s.textAlign(s.LEFT, s.CENTER);
	s.text('Sketch List',0, params.height/2);
	testDraw();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
