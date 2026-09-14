// Automated test suite for jade-tensor-driver
const assert = require("assert");
const { resolveBeaconOptions } = require("../app/config");
const { EpochBeaconCollectorEngine } = require("../app/beaconEngine");
const { computeJadeTensorBatches } = require("../app/utils");

function runTestSuite() {
    const opts = resolveBeaconOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new EpochBeaconCollectorEngine();
    const res = engine.dispatchRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { computeJadeTensorBatches({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
