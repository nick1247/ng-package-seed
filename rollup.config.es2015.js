import nodeResolve from 'rollup-plugin-node-resolve';

const utils = require('./utils');

export default {
    entry: `${utils.paths.buildDir}/${utils.getPackageName()}.js`,
    dest: `${utils.paths.distDir}/${utils.getPackageName()}.js`,
    format: 'es',
    moduleName: `${utils.getPackageName()}`,
    plugins: [
        nodeResolve({ jsnext: true, main: true })
    ],
    external: Object.keys(utils.getPeerDependencies()),
    onwarn: (warning) => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME'
        ];
        if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};