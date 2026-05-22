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

    start(secret) {
        if (this.childProcess) {
            this.emitError("Already started");
            return;
        }

        if (!this.checkInstalled()) {
            this.emitError(`Playit error: ${this.playitPath} is not found`);
            return;
        }

        this.running = true;
        this.emitChange("Starting playit");
        this.childProcess = childProcess.spawn(this.playitPath, ['--secret', secret]);
        this.childProcess.stdout.on('data', (data) => {

            const ioData = data.toString('utf8');

            if (ioData.trim().length) {
                console.log('playit message:' + ioData);
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
