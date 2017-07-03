const colors = require('colors');
const exec = (cmd) => require('child_process').execSync(cmd, { stdio: 'inherit' });
const copyfiles = require('copyfiles');
const fs = require('fs');

const utils = require('./utils');

const log = utils.log;
const logStep = utils.logStep;

const cleanDir = (dirName) => {
    logStep('cleanDir', 'cleaning ' + dirName + ' dir');
    exec(`rm -rf ${dirName} && mkdir ${dirName}`);
}

const ngc = (tsconfig) => {
    logStep('ngc', 'compiling ' + tsconfig);
    exec(`node node_modules/@angular/compiler-cli/src/main.js -p ${tsconfig}`);
}

const rollup = (rollupConfig) => {
    logStep('rollup', 'bundling ' + rollupConfig);
    exec(`node node_modules/rollup/bin/rollup -c ${rollupConfig}`);
}

const copyMetadata = (src, dest) => {
    logStep('copyMetadata', 'from ' + src + ' to ' + dest);
    exec(`cp ${src}/${utils.getPackageName()}.metadata.json ${dest}/${utils.getPackageName()}.metadata.json`);
}

const copyDeclarations = (src, dest) => {
    logStep('copyDeclarations', 'from ' + src + ' to ' + dest);

    exec(`node node_modules/copyfiles/copyfiles ${src}/**/*.d.ts ${dest}/ -u 1`);
}

const copyMaps = (src, dest) => {
    logStep('copyMaps', 'from ' + src + ' to ' + dest);

    exec(`node node_modules/copyfiles/copyfiles ${src}/src/**/*.js.map ${dest}/ -u 1`);
    
    exec(`cp ${src}/${utils.getPackageName()}.js.map ${dest}/${utils.getPackageName()}.js.map`);
}

const createPackageJson = (dest) => {
    logStep('createPackageJson', dest);
    let pkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    let targetPkgJson = {};
    let fieldsToCopy = ['name', 'version', 'description', 'author', 'repository', 'license'];
    fieldsToCopy.forEach((field) => { targetPkgJson[field] = pkgJson[field]; });

    targetPkgJson['main'] = `${utils.getPackageName()}.umd.js`;
    targetPkgJson['module'] = `${utils.getPackageName()}.es5.js`;
    targetPkgJson['es2015'] = `${utils.getPackageName()}.js`;
    targetPkgJson['typings'] = `${utils.getPackageName()}.d.ts`;

    targetPkgJson.peerDependencies = utils.getPeerDependencies();

    fs.writeFileSync(`${dest}/package.json`, JSON.stringify(targetPkgJson, null, 2));
}



const es2015 = () => {
    log.info('[es2015]');
    cleanDir(utils.paths.buildDir);

    utils.createTsConfig('es2015');
    ngc('tsconfig.es2015.json');
    exec('rm -f tsconfig.es2015.json');
    rollup('rollup.config.es2015.js');
    copyMetadata(utils.paths.buildDir, utils.paths.distDir);
    copyDeclarations(utils.paths.buildDir, utils.paths.distDir);
    copyMaps(utils.paths.buildDir, utils.paths.distDir);
    console.log();
}

const es5 = () => {
    log.info('[es5]');
    cleanDir(utils.paths.buildDir);

    utils.createTsConfig('es5');
    ngc('tsconfig.es5.json');
    exec('rm -f tsconfig.es5.json');
    rollup('rollup.config.es5.js');
    exec(`cp ${utils.paths.buildDir}/${utils.getPackageName()}.js.map ${utils.paths.distDir}/${utils.getPackageName()}.es5.js.map`);
    console.log();
}

const umd = () => {
    log.info('[umd]');
    cleanDir(utils.paths.buildDir);

    utils.createTsConfig('es5');
    ngc('tsconfig.es5.json');
    exec('rm -f tsconfig.es5.json');
    rollup('rollup.config.umd.js');
    exec(`cp ${utils.paths.buildDir}/${utils.getPackageName()}.js.map ${utils.paths.distDir}/${utils.getPackageName()}.umd.js.map`);
    console.log();
}

const build = () => {
    cleanDir(utils.paths.distDir);
    es2015();
    es5();
    umd();
    createPackageJson(utils.paths.distDir);
}

const publish = () => {
    let curVersion = exec(`npm show ${utils.getPackageName()} version`).toString().trim();
    if (curVersion == utils.getPackageVersion()) {
        log.error(`Version ${curVersion} already published`);
        return;
    }

    exec('npm run tslint');
    build();
    exec(`cd ${utils.paths.distDir} && npm publish`);

    console.log();
    log.success(`Successfully published ${utils.getPackageName()} v${utils.getPackageVersion()}`);
}

publish();