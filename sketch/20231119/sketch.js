import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "./util.js";
import * as e from "./effect.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, mp3 = {},
		dt = {},
		snd = {};
	s.preload = () => {
		s.soundFormats('wav');
		// instruments
		mp3.voices = [...Array(4)].map((_, i) => {
			const path = `assets/voice${i}.mp3`;
			const voice = s.loadSound(path);
			voice.onended(() => {
				p.isEnded[i] = true;
			});
			voice.pan(s.map(i, 0, 3, -1, 1));
			voice.disconnect();
			return voice;
		});
		mp3.ses = (() => {
			const beep = s.loadSound('assets/beep.mp3');
			beep.setVolume(0.5);
			beep.disconnect();
			const pulse = s.loadSound('assets/pulse.mp3');
			pulse.setVolume(0.7);
			pulse.disconnect();
			return { beep, pulse };
		})();
		// effect
		mp3.reverb = new p5.Reverb();
		mp3.reverb.drywet(0.3); // 1 = all reverb, 0 = no reverb
		mp3.reverb.disconnect();
		// mixer
		mp3.voiceNode = new p5.Gain();
		mp3.voices.forEach((voice) => mp3.voiceNode.setInput(voice));
		mp3.reverb.process(mp3.voiceNode, 3, 2);
		mp3.seNode = new p5.Gain();
		mp3.seNode.setInput(mp3.ses.beep);
		mp3.seNode.setInput(mp3.ses.pulse);
		mp3.main = new p5.Gain();
		mp3.main.amp(0.7);
		mp3.main.setInput(mp3.reverb);
		mp3.main.setInput(mp3.seNode);
		mp3.main.connect();
	}
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		s.createCanvas(size, size).parent('canvas');
		// analyzer
		mp3.analyzers = [...Array(4)].map(() => {
			const analyzer = new p5.Amplitude();
			analyzer.toggleNormalize(true);
			return analyzer;
		});
		mp3.voices.forEach((voice, i) => mp3.analyzers[i].setInput(voice));
		// frameRate(10);
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
		});
		s.noCursor();
		s.noLoop();
	}

	s.draw = () => {
		s.background(255);
		dt.nxt = (() => {
			if (p.isInit) return [];
			if (p.isEnded.every((status) => status === false)) return [];
			const endedIndexes = p.isEnded.flatMap((v, i) => (v === true) ? i : []);
			const waitingIndexs = mp3.voices.flatMap((s, i) => (s.isPlaying() ? [] : i));

			function getIndexes(total, length, acc = []) {
				if (acc.length === length) {
					return acc;
				}
				const randomIndex = s.floor(random() * n) + 1;
				if (!acc.includes(randomIndex)) {
					return getIndexes(total, [...acc, randomIndex]);
				} else {
					return getIndexes(total, acc);
				}
			}
			if (endedIndexes.length = waitingIndexs.length) {
				return waitingIndexs;
			} else if (endedIndexes.length < waitingIndexs.length) {
				const indexes = getIndexes(waitingIndexs.length, endedIndexes.length);
				return indexes.map(i => waitingIndexs[i]);
			} else {
				// if number of ended tracks is less than not playing tracks (irregular case)
				return getIndexes(p.isEnded.length, endedIndexes.length);
			}
		})();
		const _players = p.isInit ? [...Array(4)] : dt.players;
		dt.players = _players.map((_player, i) => {
			const player = {};
			player.ctrl = (() => {
				const ctrl = {};
				ctrl.status = (() => {
					if (p.isInit) {
						return 'keep';
					} else if (p.isEnded[i] === true) {
						if (_player.ctrl.direction === true) {
							return 'reverse';
						} else {
							return 'stop';
						}
					} else if (dt.nxt.some(v => v === i)) {
						return 'play';
					} else if (mp3.voices.every(voice => voice.isPlaying() === false)) {
						if (i === 0) return 'play';
						return 'keep';
					} else {
						return 'keep';
					}
				})();
				ctrl.direction = (() => {
					if (p.isInit) return true;
					if (ctrl.status === 'play') return true;
					if (ctrl.status === 'reverse') return false;
					return _player.ctrl.direction;
				})();
				ctrl.rate = (() => {
					if (ctrl.status === 'play') {
						return s.random(p.rate.play.min, p.rate.play.max);
					} else if (ctrl.status === 'reverse') {
						return s.random(p.rate.reverse.min, p.rate.reverse.max);
					} else if (p.isInit) {
						return 0;
					} else {
						return _player.ctrl.rate;
					}
				})();
				ctrl.duration = p.isInit ? mp3.voices[i].duration() : _player.ctrl.duration; // second
				ctrl.progress = (() => { // 0 - 1
					if (p.isInit || ctrl.status === 'stop' || ctrl.status === 'start') return 0;
					if (ctrl.status === 'reverse') return 1;
					return mp3.voices[i].currentTime() / ctrl.duration;
				})();
				return ctrl;
			})();
			player.colors = (() => {
				const colors = {};
				const { status, progress } = player.ctrl;
				colors.base = (() => {
					if (p.isInit || status === 'play') {
						const baseColor = s.lerpColor(s.color(218, 165, 32), s.color(72, 61, 139), 0.25 * (i + 1));
						return [s.red(baseColor), s.green(baseColor), s.blue(baseColor)];
					}
					return _player.colors.base;
				})();
				colors.outer = s.color(...colors.base, 255 - progress * 55);
				colors.inner = s.color(...colors.base, 30 + progress * 55);
				colors.line = s.color(...colors.base, 255 - progress * 55);
				return colors;
			})();
			player.outer = (() => {
				const outer = {};
				outer.size = (() => {
					if (p.isInit) {
						return s.createVector(size * 0.7, size * 0.4);
					} else {
						return _player.outer.size;
					}
				})();
				outer.margin = (() => {
					if (p.isInit) {
						const marginNum = 2 + 4 - 1;
						const windowSize = s.createVector(size, size)
						const marginTotal = p5.Vector.sub(windowSize, outer.size);
						const step = p5.Vector.div(marginTotal, marginNum);
						return p5.Vector.mult(step, i + 1);
					} else {
						return _player.outer.margin;
					}
				})();
				return outer;
			})();
			const _reels = p.isInit ? [...Array(2)] : _player.reels;
			player.reels = _reels.map((_reel, j) => {
				const reel = {};
				reel.mid = (() => {
					if (p.isInit) {
						const xdir = j === 0 ? -1 : 1; // left or right
						const steprate = [0.5 + 0.27 * xdir, 0.4];
						return p5.Vector.mult(player.outer.size, steprate);
					} else {
						return _reel.mid;
					}
				})();
				reel.rotate = (() => {
					const velocity = player.ctrl.rate * 0.07;
					if (player.ctrl.status === 'play') return velocity;
					if (player.ctrl.status === 'reverse') return -1 * velocity;
					if (p.isInit) return 0;
					if (player.ctrl.status === 'stop') return 0;
					if (player.ctrl.status === 'keep') return _reel.rotate;
					throw `status: ${player.ctrl.status}`;
				})();
				reel.angle = p.isInit ? 0 : _reel.angle + reel.rotate;
				reel.diameter = (() => {
					if (p.isInit) {
						return player.outer.size.x * 0.1;
					} else {
						return _reel.diameter;
					}
				})();
				reel.maxThickness = p.isInit ? player.outer.size.x * 0.2 : _reel.maxThickness;
				reel.thickness = (() => {
					if (p.isInit || player.ctrl.status === 'stop') {
						if (j === 0) return reel.maxThickness
						return 0;
					} else {
						if (j === 0) return (1 - player.ctrl.progress) * reel.maxThickness;
						return player.ctrl.progress * reel.maxThickness;
					}
				})();
				reel.outer = reel.diameter + reel.thickness;
				reel.contact = (() => {
					const angle = 0.05 * s.PI;
					if (j === 0) { // left
						const diff = p5.Vector.fromAngle(s.PI - angle, reel.outer * 0.5);
						return p5.Vector.add(reel.mid, diff);
					} else { // right
						const diff = p5.Vector.fromAngle(angle, reel.outer * 0.5);
						return p5.Vector.add(reel.mid, diff);
					}
				})();
				reel.gears = (() => {
					const radius = reel.diameter * 0.5;
					const length = radius * 0.3;
					const num = 6;
					const interval = 2 * s.PI / num;
					const pre = p.isInit ? [...Array(num)] : _reel.gears;
					return pre.map((_, k) => {
						const gear = {};
						const unit = p5.Vector.fromAngle(interval * k + reel.angle);
						gear.start = p5.Vector.add(reel.mid, p5.Vector.setMag(unit, radius - length));
						gear.end = p5.Vector.add(reel.mid, p5.Vector.setMag(unit, radius));
						return gear; // improve?
					});
				})();
				return reel;
			});
			const _anchors = p.isInit ? [...Array(2)] : _player.anchors;
			player.anchors = _anchors.map((_anchor, j) => {
				const anchor = {};
				anchor.mid = (() => {
					if (p.isInit) {
						const xdir = j === 0 ? -1 : 1; // left or right
						const steprate = [0.5 + 0.3 * xdir, 0.8];
						return p5.Vector.mult(player.outer.size, steprate);
					} else {
						return _anchor.mid;
					}
				})();
				anchor.diameter = (() => {
					if (p.isInit) {
						return player.outer.size.x * 0.03;
					} else {
						return _anchor.diameter;
					}
				})();
				anchor.contact = (() => {
					if (p.isInit) {
						const angle = 0.1 * s.PI;
						if (j === 0) { // left
							const diff = p5.Vector.fromAngle(s.PI - angle, anchor.diameter * 0.5);
							return p5.Vector.add(anchor.mid, diff);
						} else { // right
							const diff = p5.Vector.fromAngle(angle, anchor.diameter * 0.5);
							return p5.Vector.add(anchor.mid, diff);
						}
					} else {
						return _anchor.contact;
					}
				})();
				anchor.bottom = (() => {
					if (p.isInit) {
						const diff = p5.Vector.fromAngle(s.PI * 0.5, anchor.diameter * 0.5);
						return p5.Vector.add(anchor.mid, diff);
					} else {
						return _anchor.bottom;
					}
				})();
				return anchor;
			});
			player.centerline = (() => {
				if (!p.isInit) return _player.centerline;
				const centerline = {};
				const mid = p5.Vector.div(
					p5.Vector.add(player.anchors[0].bottom, player.anchors[1].bottom),
					2);
				const length = size * 0.03;
				const diff = s.createVector(0, length * 0.5);
				centerline.upper = p5.Vector.add(mid, diff);
				centerline.lower = p5.Vector.sub(mid, diff);
				return centerline;
			})();
			player.wave = (() => {
				const wave = {};
				const { status } = player.ctrl;
				const currentHeight = mp3.analyzers[i].getLevel() * size * 0.08;
				const rectWidth = size * 0.007;
				const num = 10;
				wave.sizes = p.isInit ? [...Array(num)].map((_, j) => {
						if (j === 0) return new p5.Vector(rectWidth, currentHeight);
						return new p5.Vector(0, 0);
					}) :
					_player.wave.sizes.map((_, j, self) => {
						if (j === 0) return new p5.Vector(rectWidth, currentHeight);
						return self[j - 1];
					});
				wave.poses = (p.isInit || status === 'play' || status === 'reverse') ?
					wave.sizes.map((_, j) => {
						const mid = p5.Vector.div(p5.Vector.add(player.anchors[0].bottom, player.anchors[1].bottom), 2);
						const diff = player.ctrl.direction ? -rectWidth : rectWidth;
						return p5.Vector.add(mid, new p5.Vector(diff * j, 0));
					}) :
					_player.wave.poses;
				wave.colors = wave.sizes.map((_, j) => {
					const alpha = 255 - ((255 / num) * j);
					return s.color(...player.colors.base, alpha);
				});
				return wave;
			})();
			player.texts = (() => {
				const texts = {};
				const direction = player.ctrl.direction ? 'play>>>' : 'reverse<<<';
				const status = mp3.voices[i].isPlaying() ? direction : 'stop';
				texts.size = size * 0.02;
				texts.statusString = `status: ${status}`;
				texts.statusPos = (() => {
					if (!p.isInit) return _player.texts.statusPos;
					return s.createVector(size * 0.01, player.outer.size.y - size * 0.02);
				})();
				const rateVal = (() => {
					const val = Math.round(player.ctrl.rate * 10) / 10;
					if (status === 'stop') return 'n/a';
					if (player.ctrl.direction) return `${val}`;
					return `-${val}`;
				})();
				texts.rateString = `rate: ${rateVal}`;
				texts.ratePos = (() => {
					if (!p.isInit) return _player.texts.ratePos;
					const diff = s.createVector(0, size * 0.02);
					return p5.Vector.sub(texts.statusPos, diff);
				})();
				return texts;
			})();
			return player;
		});
		dt.players.forEach((player, i) => u.pp(s, e.drawPlayer(s, player, mp3, size, i)));
		// draw cursor
		u.pp(s, () => {
			s.stroke(100, 100);
			s.line(s.mouseX, 0, s.mouseX, size);
			s.line(0, s.mouseY, size, s.mouseY);
			s.textAlign(s.RIGHT, s.BOTTOM)
			s.fill(0);
			s.text(`x(drywet): ${s.floor(s.mouseX/size*100)/100}, y(sec): ${s.floor(s.mouseY/size*10)}`, size * 0.99, size * 0.99);
		});
		u.drawFrame(s, size);
		// debug
		u.debug(s);
		// reset status
		p.isEnded = [false, false, false, false];
		if (p.isInit) p.isInit = false;
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
	}
};

new p5(sketch);