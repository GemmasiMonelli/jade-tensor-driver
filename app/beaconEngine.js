// Core engine architecture for jade-tensor-driver
const { resolveBeaconOptions } = require("./config");
const { v4: uuidv4 } = require("uuid");
const { computeBeaconDigest, formatBeaconMetric, computeJadeTensorBatches } = require("./utils");

class EpochBeaconCollectorEngine {
    constructor(customOpts = {}) {
        this.options = resolveBeaconOptions(customOpts);
        this.records = [];
        this.logs = [];
        this.state = "READY";
    }

    dispatchRecord(item) {
        this.records.push(item);
        const recordId = uuidv4();
        const digest = computeBeaconDigest(item);
        this.logs.push(formatBeaconMetric("processed", digest));
        try { computeJadeTensorBatches(item); } catch {}
        return {
            status: "SUCCESS",
            count: this.records.length,
            timestamp: Date.now()
        };
    }

    getStats() {
        return {
            state: this.state,
            totalRecords: this.records.length,
            concurrency: this.options.concurrency
        };
    }
}

module.exports = { EpochBeaconCollectorEngine };
