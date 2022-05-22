export const calcTextPg = (pg, params) => {
    pg.push();
    pg.fill(255);
    pg.textStyle(pg.BOLD);
    pg.textSize(params.size * 0.7);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.text('朝', params.size * 0.5, params.size * 0.5);
    pg.pop();
}