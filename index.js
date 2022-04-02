import { renderSketchList } from './component/sketchList.js';
import { renderCredit } from './component/credit.js';
import { renderFooter } from './component/footer.js';

const render = () => {
	renderSketchList('body', './sketch/sketch.json');
	renderCredit('credit');
	renderFooter('footer');
}

render();
