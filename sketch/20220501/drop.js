export const setDropParams = (params) => {
	const drop = {};
	drop.num = 5;
	params.drop = drop;
}

const setData = (params, s) => {
	const data = {};
	// 速度は「うっすら加速する」程度
	data.accY = Math.random() * 10;
	data.velY = Math.random() * 10;
	const calcInitPos = () => {
		// 開始時、あるいは初期化時に位置を負(画面外)とすることで、落下開始のタイミングをずらす。
		const x = Math.random() * params.size;
		const y = (-1) * Math.random() * params.size * 0.33;
		return s.createVector(x, y);
	}
	data.pos = calcInitPos();
	const x = data.pos.x;
	const calcStartPos = () => {
		// 破線の始点は上1/3でランダムとする。
		const min = 0;
		const max = params.size * 0.33;
		const diff = max - min;
		const y = Math.random() * diff + min;
		return s.createVector(x, y);
	}
	data.isDraw = false;
	data.startPos = calcStartPos();
	const calcLength = () => {
		// 破線の長さは画面サイズ1/3でランダムとする。
		const max = params.size * 0.33;
		return Math.random() * max;
	}
	const calcEndPos = () => {
		const length = calcLength();
		const y = data.startPos.y + length;
		return s.createVector(x, y);
	}
	data.endPos = calcEndPos();
	return data;
}

export const setDrops = (params, s) => {
	const drops = {};
	drops.dataArray = Array.from(Array(params.drop.num), () => setData(params, s));
	return drops;
}

const updateData = (preData) => (params, s) => {
	const newData = { ...preData };
	newData.velY = preData.velY + preData.accY;
	const updatePos = () => {
		const x = preData.pos.x;
		const y = preData.pos.y + newData.velY;
		return s.createVector(x, y);
	}
	newData.pos = updatePos();
	// 地面に落ちた時、初期化(位置、始点、長さを再計算)する。
	if (newData.pos.y > params.size) return setData(params, s);
	const calcIsDraw = () => {
		const isOverStart = (newData.pos.y > preData.startPos.y);
		const isWithinEnd = (newData.pos.y < preData.endPos.y);
		return (isOverStart && isWithinEnd);
	}
	newData.isDraw = calcIsDraw();
	return newData;
}

export const updateDrops = (preDrops, params, s) => {
	const newDrops = { ...preDrops };
	newDrops.dataArray = preDrops.dataArray.map((preData) => updateData(preData)(params, s));
	return newDrops;
};


