import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "../../component/util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt, snd = {};
	s.preload = () => {
		s.soundFormats('wav');
		snd.file_1 = s.loadSound('apollo-1');
	}
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		snd.eq_1 = new p5.EQ(3);
		snd.file_1.disconnect();
		snd.eq_1.process(snd.file_1);
		snd.fft_1 = new p5.FFT();
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		// gain
		f2.addBinding(p, 'eq_1_low_gain', {
			min: -20,
			max: 20,
		}).on('change', (ev) => {
			snd.eq_1.bands[0].gain(ev.value);
		});
		f2.addBinding(p, 'eq_1_mid_gain', {
			min: -20,
			max: 20,
		}).on('change', (ev) => {
			snd.eq_1.bands[1].gain(ev.value);
		});
		f2.addBinding(p, 'eq_1_high_gain', {
			min: -20,
			max: 20,
		}).on('change', (ev) => {
			snd.eq_1.bands[2].gain(ev.value);
		});
		// freq
		f2.addBinding(p, 'eq_1_low_freq', {
			min: 0,
			max: 1,
		}).on('change', (ev) => {
			const freq = Math.pow(10, s.map(ev.value, 0, 1, Math.log10(50), Math.log10(1000)));
			snd.eq_1.bands[0].gain(ev.value);
		});
		f2.addBinding(p, 'eq_1_mid_freq', {
			min: 0,
			max: 1,
		}).on('change', (ev) => {
			const freq = Math.pow(10, s.map(ev.value, 0, 1, Math.log10(200), Math.log10(5000)));
			snd.eq_1.bands[0].gain(ev.value);
		});
		f2.addBinding(p, 'eq_1_high_freq', {
			min: 0,
			max: 1,
		}).on('change', (ev) => {
			const freq = Math.pow(10, s.map(ev.value, 0, 1, Math.log10(1000), Math.log10(15000)));
			snd.eq_1.bands[0].gain(ev.value);
		});
	};
	s.draw = () => {
		function updateSnd() {}
		updateSnd();

		function getDt(_dt) {
			let dt = { ..._dt };
			dt.spectrum = snd.fft_1.analyze();
			// Fermat spiral : r = a * sqrt (theta)
			dt.barSizes = dt.spectrum.map(vol => s.map(vol, 0, 255, 0, size * p.barSizeRate));
			dt.angles = dt.barSizes.map((_, i) => s.map(i, 0, dt.barSizes.length, 0, 2 * Math.PI * p.laps));
			dt.poses = dt.angles.map((angle) => {
				const r = p.radiusRate * size * Math.sqrt(angle);
				const x = Math.cos(angle) * r + size * 0.5;
				const y = Math.sin(angle) * r + size * 0.5;
				return s.createVector(x, y);
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
			if (p.isInit) snd.file_1.loop();
		}
		playSnd();

		function drawDt() {
			dt.poses.forEach((pos, i) => {
				s.fill(0);
				s.rect(pos.x, pos.y, 2, dt.barSizes[i]);
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