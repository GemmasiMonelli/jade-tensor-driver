// Main application module for jade-tensor-driver
const { EpochBeaconCollectorEngine } = require("./beaconEngine");
const { resolveBeaconOptions } = require("./config");

class EpochBeaconCollector {
    constructor(options = {}) {
        this.options = resolveBeaconOptions(options);
        this.engine = new EpochBeaconCollectorEngine(this.options);
    }

    dispatch(item) {
        return this.engine.dispatchRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    EpochBeaconCollector,
    EpochBeaconCollectorEngine
};
