import * as postcss from 'postcss';
import {pluginInitializer} from './pluginInitializer';

export const plugin = postcss.plugin('esifycss', pluginInitializer);
