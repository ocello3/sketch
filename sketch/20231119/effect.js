import * as u from "./util.js";

export const playSample = (s, mp3, ctrl, size, i) => {
	if (ctrl.status === 'play' || ctrl.status === 'reverse') {
		mp3.voices[i].rate(ctrl.rate);
		if (ctrl.status === 'reverse') mp3.voices[i].reverseBuffer();
		mp3.voices[i].setVolume(0.9 - (1 - ctrl.rate) * 0.3 );
		mp3.voices[i].play();
		if  (ctrl.status === 'play') {
			mp3.ses.beep.pan(s.map(i, 0, 3, -1, 1));
			mp3.ses.beep.play();
		} else if (ctrl.status === 'reverse') {
			mp3.ses.pulse.pan(s.map(i, 0, 3, -1, 1));
			mp3.ses.pulse.play();
		}
		mp3.reverb.drywet(s.mouseX/size);
		mp3.reverb.set(s.map(s.mouseY/size, 0, 1, 0, 10));
	}
}
export const drawOuter = (s, outer, colors, ctrl, i) => () => {
	s.fill(colors.inner)
	if (ctrl.status === 'play' || ctrl.status === 'reverse') {
		s.stroke(255);
	} else {
		s.stroke(colors.inner);
	}
	s.rect(0, 0, outer.size.x, outer.size.y, 10);
}
export const drawReels = (s, reels, colors, i) => () => {
	reels.forEach((reel) => {
		s.noStroke();
		s.fill(colors.outer);
		s.circle(reel.mid.x, reel.mid.y, reel.outer);
		s.fill(255);
		s.stroke(colors.line);
		s.circle(reel.mid.x, reel.mid.y, reel.diameter);
		reel.gears.forEach(gear => s.line(gear.start.x, gear.start.y, gear.end.x, gear.end.y));
	});
}
export const drawAnchor = (s, anchors, colors) => () => {
	s.noStroke();
	s.fill(colors.line);
	anchors.forEach((anchor) => {
		s.circle(anchor.mid.x, anchor.mid.y, anchor.diameter * 1.1);
	})
}
export const drawTape = (s, reels, anchors, colors) => () => {
	s.stroke(colors.line);
	reels.forEach((reel, j) => {
		s.line(reel.contact.x, reel.contact.y, anchors[j].contact.x, anchors[j].contact.y);
	});
	s.line(anchors[0].bottom.x, anchors[0].bottom.y, anchors[1].bottom.x, anchors[1].bottom.y);
}
export const drawCenter = (s, centerline, colors) => () => {
	s.stroke(colors.line);
	s.line(centerline.upper.x, centerline.upper.y, centerline.lower.x, centerline.lower.y);
}
export const drawWave = (s, wave) => () => {
	s.rectMode(s.CENTER);
	s.noStroke();
	wave.poses.forEach((pos, j) => {
		s.fill(wave.colors[j]);
		s.rect(pos.x, pos.y, wave.sizes[j].x, wave.sizes[j].y);
	});
}
export const drawText = (s, texts, colors) => () => {
	s.textSize(texts.size);
	s.textAlign(s.LEFT, s.BOTTOM);
	s.fill(s.color([...colors.base]));
	s.text(texts.statusString, texts.statusPos.x, texts.statusPos.y);
	s.text(texts.rateString, texts.ratePos.x, texts.ratePos.y);
}
export const drawPlayer = (s, player, mp3, size, i) => () => {
	const { outer, reels, anchors, ctrl, colors, wave, centerline, texts } = player;
	s.translate(outer.margin);
	s.strokeWeight(size * 0.003);
	playSample(s, mp3, ctrl, size, i);
	u.pp(s, drawOuter(s, outer, colors, ctrl, i));
	u.pp(s, drawReels(s, reels, colors, i));
	u.pp(s, drawAnchor(s, anchors, colors));
	u.pp(s, drawTape(s, reels, anchors, colors));
	u.pp(s, drawWave(s, wave));
	u.pp(s, drawCenter(s, centerline, colors));
	u.pp(s, drawText(s, texts, colors));
}