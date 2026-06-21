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
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
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
	};
	s.draw = () => {
		function updateSnd() {}
		updateSnd();

		function getDt(_dt) {
			let dt = { ..._dt };
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, p, 2);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;

		function playSnd() {
			// snd.onset.update(snd.fft);
			if (p.isInit) snd.file_1.loop();
		}
		playSnd();

		function drawDt() {}
		drawDt();

		// itit params
		// p.isMoved = false;
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);