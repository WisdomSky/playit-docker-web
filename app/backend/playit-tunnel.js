const childProcess = require("child_process");
const fs = require("fs");
const commandExistsSync = require("command-exists").sync;

class PlayitTunnel {

    constructor(playitPath = "playit") {
        this.playitPath = playitPath;
    }

    checkInstalled() {
        return commandExistsSync(this.playitPath);
    }

    emitChange(msg, code) {
        if (this.change) {
            this.change(this.running, msg, code);
        }
    }

    emitError(msg) {
        if (this.error) {
            this.error(msg);
        }
    }

    start(additionalArgs = {}) {
        if (this.childProcess) {
            this.emitError("Already started");
            return;
        }

        if (!this.checkInstalled()) {
            this.emitError(`Playit error: ${this.playitPath} is not found`);
            return;
        }

        const args = [];

        this.running = true;
        this.emitChange("Starting playit");
        this.childProcess = childProcess.spawn(this.playitPath, args);
        this.childProcess.stdout.on('data', (data) => {

            if (data.toString().toLocaleLowerCase().indexOf('invalid secret') !== -1) {
                this.stop();
                fs.unlinkSync(childProcess.execSync(`${this.playitPath} secret-path`).toString('utf8').trim());
                this.start(additionalArgs);
                return false;
            }

            if (data.toString().toLocaleLowerCase().indexOf('visit link to setup') !== -1) {
                if (!!additionalArgs.claimLinkCallback && typeof additionalArgs.claimLinkCallback === 'function') {
                    additionalArgs.claimLinkCallback(data.toString().replace(/^.*(https\:\/\/.*)$/,'$1').split('\u001b', 2)[0])
                }
            }

            if (data.toString().toLocaleLowerCase().indexOf('program approved') !== -1 ||
                data.toString().toLocaleLowerCase().indexOf('secret key valid') !== -1) {
                if (!!additionalArgs.claimedCallback && typeof additionalArgs.claimedCallback === 'function') {
                    additionalArgs.claimedCallback()
                }
            }
        })

        this.childProcess.stderr.pipe(process.stderr);

        this.childProcess.on("close", (code) => {
            this.running = false;
            this.childProcess = null;
            this.emitChange("Stopped playit", code);
        });

        this.childProcess.on("error", (err) => {
            if (err.code === "ENOENT") {
                this.emitError(`Playit error: ${this.playitPath} is not found`);
            } else {
                this.emitError(err);
            }
        });

        this.childProcess.stderr.on("data", (data) => {
            this.emitError(data.toString());
        });
    }

    stop() {
        this.emitChange("Stopping playit");
        if (this.childProcess) {
            this.childProcess.kill("SIGINT");
            this.childProcess = null;
        }
    }
}

module.exports = { PlayitTunnel };
