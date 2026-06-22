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
		// gain
		f2.addBinding(p, 'resononce', {
			min: 1,
			max: 20,
		}).on('change', (ev) => {
			snd.filter.res(ev.value);
		});
		f2.addBinding(p, 'cutoff', {
			min: 0,
			max: 1,
		}).on('change', (ev) => {
			const freq = Math.pow(10, s.map(ev.value, 0, 1, Math.log10(80), Math.log10(8000)));
			snd.filter.freq(freq);
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
			dt.angles = (p.isInit || dt.poses[0].x > size * 1.2) ?
				dt.barSizes.map((_, i) => s.map(i, 0, dt.barSizes.length, 0, 2 * Math.PI * p.laps)):
				dt.angles.map(angle => angle + 0.02);
			dt.poses = dt.angles.map((angle) => {
				const r = p.radiusRate * size * Math.sqrt(angle);
				const x = Math.cos(angle) * r + size * 0.5;
				const y = Math.sin(angle) * r * 0.5 + size * 0.5;
				return s.createVector(x, y, r);
			});
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