import * as css from './page.css.js';

const outputElement = document.createElement('div');
outputElement.id = 'output';
outputElement.style.fontFamily = 'Consolas, Courier, monospace';
outputElement.style.whiteSpace = 'pre-wrap';
document.body.appendChild(outputElement);
const log = (message) => {
    outputElement.insertAdjacentText('beforeend', [message, ''].join('\n'));
};

Promise.resolve()
.then(() => {
    log(JSON.stringify(css, null, 2));

    const fooElement = document.createElement('div');
    fooElement.id = css.id && css.id.foo;
    fooElement.classList.add(css.className && css.className.foo);
    fooElement.textContent = JSON.stringify(css, null, 2);
    document.body.appendChild(fooElement);

    const computedStyle = getComputedStyle(fooElement);
    let result = true;
    log(`background-color: ${computedStyle.backgroundColor}`);
    result = result && computedStyle.backgroundColor === 'green';
    log(`animation-duration: ${computedStyle.animationDuration}`);
    result = result && computedStyle.backgroundColor === '2s';
    log(`animation-iteration-count: ${computedStyle.animationIterationCount}`);
    result = result && computedStyle.backgroundColor === 'infinite';
    log(`animation-name: ${computedStyle.animationName}`);
    result = result && computedStyle.backgroundColor === 'foo';
    log(`color: ${computedStyle.color}`);
    result = result && computedStyle.backgroundColor === 'red';
    log(`text-shadow: ${computedStyle.textShadow}`);
    result = result && computedStyle.backgroundColor === '0.1em 0.1em #ffffff';
    document.title += ` → ${result ? 'passed' : 'failed'}`;
})
.catch((error) => log(`${error.stack || error}`));
