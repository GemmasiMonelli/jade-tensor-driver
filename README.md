# jade-tensor-driver

**Deterministic microservice batching for bounded-memory tensor workloads.**

## Overview & Problem Statement

jade-tensor-driver coordinates bounded-memory tensor workloads in a microservice. It accepts tensors with a declared byte size, groups them into deterministic batches, and returns compact batch descriptors so the service can queue, persist, or transmit work without retaining the full workload.

The driver addresses several common microservice constraints:

- **Backpressure:** A bounded queue or batch budget can be enforced by the service around each returned batch.
- **Memory safety:** Tensor payloads are not copied or materialized by the driver; only descriptors are returned.
- **Predictability:** Batch boundaries are deterministic for the same input order, `batchSize`, and `maxBytes`.
- **Streaming:** Inputs are consumed sequentially, so a producer can append tensors while the consumer drains batches.
- **Operational clarity:** Errors identify malformed tensor metadata before a batch is submitted to a worker.

## Core Architecture & Highlights

- **Tensor validation:** Each tensor must be an object with a numeric `data` array and a non-negative integer `dtypeBytes` field.
- **Deterministic batching:** Tensors are assigned in input order. A new batch starts when the next tensor would exceed `maxBytes` or when `batchSize` is reached.
- **Bounded descriptors:** The output contains `{ tensors, bytes }` descriptors rather than deep copies of tensor data.
- **Pure JavaScript helper:** `computeJadeTensorBatches` is a dependency-free CommonJS function suitable for embedding in a service, worker, or test harness.
- **Microservice integration points:** The service can connect the helper to a bounded queue, durable log, request logger, or worker pool.
- **Failure isolation:** Invalid input fails fast with `TypeError` or `RangeError`, preventing malformed batches from entering the pipeline.
- **Streaming-friendly API:** The helper processes a tensor collection in one pass and can be adapted to an async iterator for large producers.

## Installation

```bash
npm install jade-tensor-driver
```

## Quick Start

```js
'use strict';

const { computeJadeTensorBatches } = require('jade-tensor-driver');

const tensors = [
  { name: 'embeddings', data: [1, 2, 3, 4], dtypeBytes: 4 },
  { name: 'features',   data: [5, 6],           dtypeBytes: 4 },
  { name: 'labels',     data: [0, 1, 0],        dtypeBytes: 1 },
];

const batches = computeJadeTensorBatches(tensors, {
  batchSize: 2,
  maxBytes: 8,
});

console.log(batches);
// [
//   { tensors: [tensors[0], tensors[1]], bytes: 8 },
//   { tensors: [tensors[2]], bytes: 1 },
// ]
```

The returned tensors are references to the original tensor objects. This keeps the helper inexpensive while leaving ownership and lifecycle management to the surrounding microservice.

## Configuration / Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `batchSize` | integer | `1` | Maximum tensors per batch. Values below `1` are treated as `1`. |
| `maxBytes` | integer | `1048576` | Maximum aggregate tensor byte size per batch. Values below `1` are treated as `1`. |

The helper currently accepts a synchronous array-like collection of tensor objects. A production service should place a bounded queue between the HTTP/gRPC boundary and this helper to apply backpressure, and should use a durable queue or log when batches must survive process restarts.

## Performance & Design Constraints

- **Time complexity:** `O(n)`, where `n` is the number of tensors. Each tensor is validated and assigned once.
- **Auxiliary space:** `O(b)` for the returned batch descriptors, where `b` is the number of batches. Tensor payloads are not copied.
- **Determinism:** Output order follows input order. Do not rely on object key ordering or concurrent mutation of the input collection.
- **Memory constraints:** `maxBytes` bounds descriptor-level accounting, not the memory held by the original tensor arrays. Producers must still apply their own backpressure.
- **Type safety:** JavaScript has no compile-time tensor schema. Validate `data`, `dtypeBytes`, and tensor identity at the service boundary before calling the helper.
- **Concurrency:** The helper is synchronous and has no shared mutable state. Use separate worker processes or an explicit scheduler for parallel execution.
- **Operational limits:** Very large arrays still require enough memory to hold the input and output. For unbounded producers, adapt the same batching rule to a streaming iterator.

## License

MIT License © 2026 Gemmasi Monelli (@GemmasiMonelli)