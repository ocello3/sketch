import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "./util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt = {},
		snd = {};

	s.preload = () => {
		s.soundFormats('wav');
		// snd.rain = s.loadSound('./rain.wav');
	}

	s.setup = async () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();

		function setMovers() {
			return Array.from(Array(p.mover.num), () => {
				const mass = s.map(Math.random(), 0, 1, p.mover.massMin, p.mover.massMax);
				const initVel = (() => {
					const x = Math.random() * p.mover.velXmax;
					const y = Math.random() * p.mover.velYmax;
					return new p5.Vector().set(x, y);
				})();
				const mover = {
					mass: mass,
					gravityAcc: new p5.Vector().set(0, p.mover.gravity / p.mover.mass),
					initVel: initVel,
					acc: new p5.Vector().set(0, 0),
					windAcc: new p5.Vector().set(0, 0),
					vel: initVel,
					pos: (() => {
						const x = Math.random() * size;
						const y = Math.random() * size;
						return new p5.Vector().set(x, y);
					})(),
				};
				return mover;
			});
		}
		dt.movers = setMovers();

		function setWinds() {
			const { num, lengthMin, lengthMax } = p.wind;
			return {
				winds: Array.from(Array(num), () => {
					const startPos = (() => {
						const x = Math.random() * size;
						const y = Math.random() * size;
						return new p5.Vector().set(x, y);
					})();
					const wind = {
						length: s.map(Math.random(), 0, 1, lengthMin, lengthMax),
						vec: new p5.Vector().set(0, 0),
						startPos,
						endPos: startPos,
						isReset: false,
					};
					return wind;
				}),
			};
		}
		dt.winds = setWinds();

		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
			snd.rain.play();
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		f2.addBinding(p.mover, "windF", { min: 0, max: 10 });
		f2.addBinding(p.mover, "bufferRate", {
			min: p.mover.bufferRateMin,
			max: 1.1,
		});
		f2b.addBinding(p.wind, "gravityRate", { step: 0.5, min: 1, max: 5 });
	};

	s.draw = () => {
		s.background(255);
		
		function updateMovers(preMovers) {
			return dt.movers.map((preMover) => {
				const newMover = { ...preMover };
				newMover.windAcc = new p5.Vector(p.mover.windF / preMover.mass, 0);
				newMover.acc = (() => {
					const gravity = preMover.gravityAcc;
					const wind = newMover.windAcc;
					return p5.Vector.add(gravity, wind);
				})();
				const updatePos = (newVel) =>
					p5.Vector.add(preMover.pos, newVel);
				const updateVel = (isXOver, isYOver) => {
					const newVel = p5.Vector.add(preMover.vel, newMover.acc);
					const x = isXOver ? newVel.x * -1 * p.mover.bufferRate : newVel.x;
					const y = isYOver ? newVel.y * -1 * p.mover.bufferRate : newVel.y;
					return new p5.Vector().set(x, y);
				};
				newMover.vel = (() => {
					const newVel = updateVel(false, false);
					const newPos = updatePos(newVel);
					const isXOver = newPos.x < 0 || newPos.x > size;
					const isYOver = newPos.y > size;
					return updateVel(isXOver, isYOver);
				})();
				newMover.pos = (() => {
					const newPos = updatePos(newMover.vel);
					const check = (prop) => {
						if (prop === "x" && newPos[prop] < 0) return 0;
						if (newPos[prop] > size) return size;
						return newPos[prop];
					};
					return new p5.Vector().set(check("x"), check("y"));
				})();
				return newMover;
			});
		}
		dt.movers = updateMovers(dt.movers);

		function updateWinds(preData, moverData) {
			const newData = { ...preData };
			newData.winds = preData.winds.map((preWind, index) => {
				const newWind = { ...preWind };
				const mover = moverData[index];
				const {
					lengthMin,
					lengthMax,
					gravityRate,
					windRate,
					bufferAdjustRate,
					bufferBaseRate,
				} = p.wind;
				const { bufferRate, bufferRateMin } = p.mover;
				newWind.vec = (() => {
					const buffer =
						(bufferRate - bufferRateMin + bufferBaseRate) * bufferAdjustRate;
					const originalVec = p5.Vector.mult(mover.acc, bufferRate * buffer);
					const adjustRate = new p5.Vector().set(windRate, gravityRate);
					return p5.Vector.mult(originalVec, adjustRate);
				})();
				newWind.length = (() => {
					if (preWind.isReset)
						return s.map(Math.random(), 0, 1, lengthMin, lengthMax);
					return preWind.length - p5.Vector.mag(newWind.vec);
				})();
				newWind.isReset = (() => {
					if (preWind.isReset) return false;
					return newWind.length < 0;
				})();
				newWind.startPos = (() => {
					if (newWind.isReset) {
						const x = Math.random() * size;
						const y = Math.random() * size;
						return new p5.Vector().set(x, y);
					}
					return preWind.startPos;
				})();
				newWind.endPos = (() => {
					if (newWind.isReset) return newWind.startPos;
					return p5.Vector.add(preWind.endPos, newWind.vec);
				})();
				return newWind;
			});
			return newData;
		}
		updateWinds(dt.winds, dt.movers);

		function drawMovers(data) {
			const { fontSizeRate } = p.mover;
			s.push();
			let i = 0;
			for (const mover of data) {
				const { pos, mass } = mover;
				s.textSize(size * fontSizeRate * mass);
				s.text(i, pos.x, pos.y);
				i++;
			}
			s.pop();
		}
		drawMovers(dt.movers);

		function drawWinds(data) {
			s.push();
			s.strokeWeight(3);
			s.stroke(0, 60);
			for (const wind of data.winds) {
				const { startPos, endPos } = wind;
				s.line(startPos.x, startPos.y, endPos.x, endPos.y);
			}
			s.pop();
		}
		drawWinds(dt.winds);

		u.drawFrame(s, size);
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);