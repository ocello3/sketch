// 3層目

export const setRippleParams = (params) => {
	const ripple = {};
	ripple.deformationRate = 0.25;
}

const setData = (dropsData) =>{
	const data = {};
	return data;
}

export const setRipples = (dropsDataArray, params) => {
	const repples = {};
	// 水滴のデータ（drops.js）を用いて波紋のデータを生成する。
	repples.dataArray = dropsDataArray.map(dropsData => setData(dropsData));
	return repples;
}
