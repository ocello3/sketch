export const setLineParams = (params) => {
	const Line = {};
	Line.num = 10;
	params.Line = Line;
}

const setData = (params, s) => {
	const data = {};
	return data;
}

export const setLines = (params, s) => {
	const Lines = {};
	Lines.dataArray = Array.from(Array(params.Line.num), () => setData(params, s));
	return Lines;
}

const updateData = (preData) => (params, s) => {
	const newData = { ...preData };
	return newData;
}

export const updateLines = (preLines, params, s) => {
	const newLines = { ...preLines };
	newLines.dataArray = preLines.dataArray.map((preData) => updateData(preData)(params, s));
	return newLines;
};

const drawLine = (data, params, s) => {
	s.push();
	return false;
}

export const drawLines = (Lines, params, s) => {
	for (const data of Lines.dataArray) drawLine(data, params, s);
	return false;
}
