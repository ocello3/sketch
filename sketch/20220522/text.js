export const setTextParams = (params, tab) => {
    params.text = {
        velocityRate: 0.02,
    };
	tab.pages[1].addInput(params.text, 'velocityRate', { min: 0.005, max: 0.02});
    return false;
}

export const calcTextObj = (preTextObj, params, s) => {
    const newTextObj = {};
	newTextObj.isInit = false;
    newTextObj.text = '今日はやる気がありません。';
    const calcPos = () => {
        const x = preTextObj.isInit? 0: preTextObj.pos.x - params.size * params.text.velocityRate;
        const y = preTextObj.isInit? params.size * 0.5: preTextObj.pos.y;
        return s.createVector(x, y);
    }
    newTextObj.pos = calcPos();
    return newTextObj;
}

export const drawText = (textObj, pg, params) => {
    pg.background(0);
    pg.push();
    pg.fill(255);
    pg.textStyle(pg.BOLD);
    pg.textSize(params.size * 0.7);
    pg.textAlign(pg.LEFT, pg.CENTER);
    pg.text(textObj.text, textObj.pos.x, textObj.pos.y);
    pg.pop();
}