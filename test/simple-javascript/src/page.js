import * as css from './page.css';
const result = document.createElement('div');
result.id = css.id.result;
result.classList.add(css.className.result);
result.textContent = JSON.stringify(css, null, 2);
document.body.appendChild(result);
