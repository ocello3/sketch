const init = (params, s, tab) => {
	params.flooder = {
		surfaceYPosRate: 0.5,
		g: 0.8,
		mMin: 5,
		mMax: 100,
		initPosMaxRate: 0.3,
		text: "Create pockets",
	}
	const _param = params.flooder;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 }); //
	const flooderObj = {};
	const { surfaceYPosRate, text } = _param;
	flooderObj.num = _param.text.length;
	flooderObj.surfaceYPos = params.size * surfaceYPosRate;
	flooderObj.isReset = true;
	flooderObj.flooders = Array.from(Array(flooderObj.num), (_, index) => {
		const flooder = {};
		flooder.font = text[index];
		flooder.isOver = true;
		return flooder;
	});
	return flooderObj;
}

const update = (preObj, params, s) => {
	const newObj = { ...preObj };
	const { mMin, mMax, g, initPosMaxRate } = params.flooder;
	const { isReset } = preObj;
	newObj.mArray = (() => {
		if (isReset) {
			return Array.from(Array(preObj.num), () => {
				return s.map(Math.random(), 0, 1, mMin, mMax);
			});
		}
		return preObj.mArray;
	})();
	newObj.textWidthArray = (() => {
		if (isReset) {
			return newObj.mArray.map((m, index) => {
				s.textSize(m);
				return s.textWidth(preObj.flooders[index].font);
			});
		}
		return preObj.textWidthArray;
	})();
	newObj.flooders = preObj.flooders.map((preFlooder, index) => {
		const newFlooder = { ...preFlooder };
		const updatePos = () => p5.Vector.add(preFlooder.pos, newFlooder.v);
		newFlooder.m = newObj.mArray[index];
		newFlooder.v = (() => {
			if (isReset) return s.createVector(0, 0);
			return p5.Vector.add(preFlooder.v, s.createVector(0, g));
		})();
		newFlooder.pos = (() => {
			if (isReset) {
				const splitedTextWidthArray = newObj.textWidthArray.slice(0, index);
				const x = splitedTextWidthArray.reduce((prev,current)=>prev + current,0);
				const y = (-1) * Math.random() * initPosMaxRate * params.size;
				return s.createVector(x, y);
			}
			return updatePos();
		})();
		newFlooder.isOver = (newFlooder.pos.y > params.size);
		return newFlooder;
	});
	newObj.isReset = (() => {
		for (const flooder of newObj.flooders) {
			if (flooder.isOver === false) return false;
		}
		return true;
	})();
	return newObj;
}

const draw = (obj, params, s) => {
	const { surfaceYPos } = obj;
	// draw water
	s.push();
	s.fill(0, 30);
	s.rect(0, surfaceYPos, params.size, params.size - surfaceYPos);
	s.pop();
	// draw flooders
	s.push();
	for (const flooder of obj.flooders) {
		const { m, font, pos } = flooder;
		s.textSize(m);
		s.text(font, pos.x, pos.y);
	}
	s.pop();
}

export const flooder = { init, update, draw }
