import test, {ThrowsExpectation} from 'ava';
import {compileOverwrites} from './compileOverwrites';

interface ITest {
    input: Parameters<typeof compileOverwrites>,
    expected: ReturnType<typeof compileOverwrites> | {error: ThrowsExpectation},
}

([
    {
        input: [{}, {name: 'foo', nodes: []}],
        expected: {error: {message: /^Invalid <single-animation>/}},
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${JSON.stringify(input)} → ${'error' in expected ? 'Error' : JSON.stringify(expected)}`, (t) => {
        if ('error' in expected) {
            t.throws(() => compileOverwrites(...input), expected.error);
        } else {
            t.is(compileOverwrites(...input), expected);
        }
    });
});
