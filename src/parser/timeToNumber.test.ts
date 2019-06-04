import test from 'ava';
import {timeToNumber} from './timeToNumber';
import {fromString} from '@nlib/infra';

interface ITest {
    value: string,
    unit: string,
    expected: number | null,
}

([
    {value: '1', unit: 's', expected: 1},
    {value: '2', unit: 'ms', expected: 0.002},
    {value: '2', unit: 'μs', expected: null},
] as Array<ITest>).forEach(({value, unit, expected}) => {
    test(`${value}${unit} → ${expected === null ? 'Error' : expected}`, (t) => {
        const node = {
            name: 'time',
            nodes: [
                {name: 'value', nodes: [...fromString(value)]},
                {name: 'unit', nodes: [...fromString(unit)]},
            ],
        };
        if (expected === null) {
            t.throws(() => timeToNumber(node), {message: /^Invalid <time-unit>/});
        } else {
            const actual = timeToNumber(node);
            t.is(actual, expected);
        }
    });
});
