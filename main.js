if (typeof require !== 'undefined' && require.main === module) {
    require('./action').run(process.argv.slice(2));
}

