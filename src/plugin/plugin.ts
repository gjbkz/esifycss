import postcss = require('postcss');
import {createTransformer} from './createTransformer';
export const plugin = postcss.plugin('esifycss', createTransformer);
