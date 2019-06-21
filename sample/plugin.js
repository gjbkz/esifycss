const postcss = require('postcss');
const esifycss = require('..');
const css = `
@keyframes aaa {
    0% {
        color: red;
    }
    100% {
        color: green;
    }
}
#foo>.bar {
    animation-name: aaa;
}
`;
postcss([
    esifycss.plugin(),
])
.process(css, {from: '/foo/bar.css'})
.then((result) => {
    const pluginResult = esifycss.extractPluginResult(result);
    console.log(pluginResult);
    // → {
    //     class: {bar: '_1'},
    //     id: {foo: '_0'},
    //     keyframes: {aaa: '_2'},
    // }
});
