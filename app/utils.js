// Utility helper functions for jade-tensor-driver
const crypto = require("crypto");
const { beaconConfig } = require("./config");

function computeBeaconDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatBeaconMetric(label, value) {
    return `[${beaconConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateBeaconState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Deterministic bounded tensor batching for microservices
function computeJadeTensorBatches(tensors, options) {
  const opts = options || {};
  const batchSize = Math.max(1, Math.floor(opts.batchSize || 1));
  const maxBytes = Math.max(1, Math.floor(opts.maxBytes || 1024 * 1024));
  const encoded = [];
  for (const tensor of tensors) {
    if (!tensor || typeof tensor !== 'object' || !Array.isArray(tensor.data)) {
      throw new TypeError('Each tensor requires a numeric data array');
    }
    const bytes = tensor.data.length * tensor.dtypeBytes;
    if (!Number.isInteger(bytes) || bytes < 0) {
      throw new RangeError('dtypeBytes must be a non-negative integer');
    }
    encoded.push({ tensor, bytes });
  }
  const batches = [];
  let current = { tensors: [], bytes: 0 };
  for (const item of encoded) {
    if (current.bytes && current.bytes + item.bytes > maxBytes) {
      batches.push(current);
      current = { tensors: [], bytes: 0 };
    }
    current.tensors.push(item.tensor);
    current.bytes += item.bytes;
  }
  if (current.tensors.length) batches.push(current);
  return batches;
}

module.exports = {
    computeBeaconDigest,
    formatBeaconMetric,
    validateBeaconState,
    computeJadeTensorBatches
};
