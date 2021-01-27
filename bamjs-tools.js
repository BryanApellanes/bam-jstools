var bamJsTools = (function () {
    var cliArgs = require('@bamapps/bam-cli-args'),
        _ = require('underscore'),
        actionsCore = require('@actions/core');

    var dependencies = {
        cliArgs: cliArgs,
        actionsCore: actionsCore
    }

    return {
        bamArgs: cliArgs.args,
        scriptInfo: cliArgs.scriptInfo,
        run: function (scriptArgs) {
            
            console.log(cliArgs.scriptInfo());
        },
        inject: function (obj) {
            dependencies = _.extend({}, dependencies, obj);
        },
        startProcess: function (options) {
            var opts = _.extend({}, { command: '', args: [], onStdOut: function () { }, onStdErr: function () { }, onExit: function () { } }, options);
            const { spawn } = require('child_process');
            const childProcess = spawn(opts.command, opts.args);
            childProcess.stdout.on('data', (data) => {
                opts.onStdOut(data);
            })
            childProcess.stderr.on('data', (data) => {
                opts.onStdErr(data);
            })
            childProcess.on('exit', (code) => {
                opts.onExit(code);
            })
        },
        exec: function (command, argsArray) {
            var _the = this;
            return new Promise((resolve, reject) => {
                _the.startProcess({
                    command: command,
                    args: argsArray,
                    onStdOut: function (data) {
                        resolve(data);
                    },
                    onStdErr: function (data) {
                        reject(data);
                    }
                });
            });
        },
    }
})()

if (typeof require !== 'undefined' && require.main === module) {
    bamJsTools.run(process.argv.slice(2));
}

module.exports = bamJsTools;