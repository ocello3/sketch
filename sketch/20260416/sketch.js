import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "../../component/util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt, snd = {};
	s.preload = () => {
		s.soundFormats('wav');
		snd.file = s.loadSound('apollo-1');
	}
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		snd.filter = new p5.Filter('lowpass');
		snd.file.disconnect();
		snd.filter.process(snd.file);
		snd.fft = new p5.FFT();
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		f1.addBinding(p, 'rotateVel', {
			min: 0.005,
			max: 1,
		});
		f2.addBinding(p, 'res', {
			min: 10,
			max: 50,
		});
		f2.addBinding(p, 'freq', {
			min: 2000,
			max: 10000,
		});
	};
	s.draw = () => {
		function updateSnd() {}
		updateSnd();

		function getDt(_dt) {
			let dt = { ..._dt };
			dt.spectrum = snd.fft.analyze();
			// Fermat spiral : r = a * sqrt (theta)
			dt.barSizes = dt.spectrum.map(vol => s.map(vol, 0, 255, 0, size * p.barSizeRate));
			dt.angles = (p.isInit || dt.poses[0].x > size *1.2) ?
				dt.barSizes.map((_, i) => s.map(i, 0, dt.barSizes.length, 0, 2 * Math.PI * p.laps)):
				dt.angles.map(angle => angle + p.rotateVel);
			dt.poses = dt.angles.map((angle) => {
				const r = p.radiusRate * size * Math.sqrt(angle);
				const x = Math.cos(angle) * r + size * 0.5;
				const y = Math.sin(angle) * r * 0.3 + size * 0.3;
				return s.createVector(x, y, r);
			});
			dt.filter = (() => {
				let filter = {};
				const maxFreq = size * 1.2;
				filter.freq = Math.pow(10, s.map(dt.poses[0].x, 0, maxFreq, Math.log10(80), Math.log10(p.freq)));
				const maxRes = size * 0.5 * Math.sqrt(2) * 1.2;
				filter.resononce = s.map(dt.poses[0].z, 0, maxRes, 1, p.res);
				return filter;
			})();
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt, 5);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;

		function playSnd() {
			// snd.onset.update(snd.fft);
			if (p.isInit) snd.file.loop();
			snd.file.rate(p.rotateVel * 10);
			snd.filter.res(dt.filter.resononce);
			snd.filter.freq(dt.filter.freq);
		}
		playSnd();

		function drawDt() {
			dt.poses.forEach((pos, i) => {
				s.fill(0, 80);
				s.noStroke();
				const height = dt.barSizes[i] > 1 ? dt.barSizes[i] : 0;
				s.rect(pos.x, pos.y, size * 0.008, height);
			});
		}
		drawDt();

		// itit params
		// p.isMoved = false;
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);