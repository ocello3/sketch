import { s } from './sketch.js';
import { updateDot } from './dot.js';

export const setPoly = () => (params, grid) => {
	const initPoly = {};
	initPoly.centerPos = s.createVector(params.size/2, params.size/2);
	initPoly.dists = Array.from(Array(grid.length), dot => 0);
	return initPoly;
}

/*
requirement
distが一定以下の時は含めない
noiseの値が一定以下の時は含めない
以上の条件を満たすときに配列にdist, pos, noiseの値を追加する。
考え中
- testをsetupとdrawそれぞれで実施する？実行ようの'const sketch = s => {'を'const testSketch'とかにして分ける？
*/

const updateDists = (centerPos, grid) => {
	return grid.map(dot => dot.pos.dist(centerPos));
}

const updatePoss = (updatedDists, grid, params) => {
	const poss = [];
	updatedDists.forEach((dist, index) => {
		if (dist < params.dist_max) poss.push(grid[index].pos);
	});
	return poss;
}

export const updatePoly = (prePoly) => (grid) => {
	const newPoly = { ...prePoly };
	newPoly.dists = updateDists(newPoly.centerPos, grid);
	return newPoly;
}

export const testUpdatedPoly = (params, grid) => {
	const updatedDists = updateDists(initPoly.centerPos, newGrid);
	updatedDists.forEach((dist, index) => {
		console.assert(dist >= 0, `dist: ${dist}, index: ${index}`);
	});
}
