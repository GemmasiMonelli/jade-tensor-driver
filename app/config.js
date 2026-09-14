// Configuration for jade-tensor-driver
const os = require("os");
const path = require("path");
try {
    const dotenv = require("dotenv");
    dotenv.config({ silent: true });
} catch {}
let logConfig = () => {};
try {
    const debug = require("debug");
    logConfig = debug("app:config");
} catch {}

const beaconConfig = {
    appName: "jade-tensor-driver",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "6905", 10),
    timeoutMs: 16582,
    maxBufferItems: 254,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

logConfig("Loaded options for %s", "jade-tensor-driver");
function resolveBeaconOptions(overrides = {}) {
    return Object.assign({}, beaconConfig, overrides);
}

module.exports = {
    beaconConfig,
    resolveBeaconOptions
};
