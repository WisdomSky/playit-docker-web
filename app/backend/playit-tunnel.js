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

        const args = ['-s'];

        this.running = true;
        this.emitChange("Starting playit");
        this.childProcess = childProcess.spawn(this.playitPath, args);
        this.childProcess.stdout.on('data', (data) => {

            const ioData = data.toString('utf8');

            if (ioData.trim().length) {
                console.log('playit message:' + ioData);
            }

            if (ioData.toLocaleLowerCase().indexOf('invalid secret') !== -1) {
                this.stop();
                fs.unlinkSync(childProcess.execSync(`${this.playitPath} secret-path`).toString('utf8').trim());
                this.start(additionalArgs);
                return false;
            }

            if (ioData.toLocaleLowerCase().indexOf('visit link to setup') !== -1) {
                if (!!additionalArgs.claimLinkCallback && typeof additionalArgs.claimLinkCallback === 'function') {
                    const claimLink = ioData.replace(/.*(https\:\/\/.*)$/gmi,'$1').trim();
                    additionalArgs.claimLinkCallback(claimLink)
                }
            }

            if (ioData.toLocaleLowerCase().indexOf('program approved') !== -1 ||
                ioData.toLocaleLowerCase().indexOf('secret key valid') !== -1) {
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
