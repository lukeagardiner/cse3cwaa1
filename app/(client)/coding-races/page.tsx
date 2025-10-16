// coding-races/page.tsx

"use client"
import React, {use, useEffect, useMemo, useRef, useState} from "react";
import {clearInterval} from "node:timers";
// Next.js app router: read [stage] from useParams
// import { userParams } from "next/navigation";
// React Router: use useParams from "react-router-dom"

type Stage = "safe" | "key" | "door";

type RunStatus = "idle" | "running" | "success" | "error" | "timeout";

// TODO
// have a ran function to set the code on each attempt
// we want a minimum timer on this one as it can't expire any sooner than it takes to run all the combinations
// could make it a little more challenging by saying numbers 0-5 and letters abc and the combination always contains a repeat
// must cover 000 as string

// Most basic example without extended conditions above
/*
function buteForce(combination: string) {
    // ...your code goes here
    for (let i = 0; i <= 999; i++ {
        // hint-1 zero-pad to 3 digits if you want to print: i.toString().padStart(3, "0")
        string code = '';
        if (i === 0) {
            code = '000'; // cater to three digits....
            // also have to cater to leading zeros etc
        }
        else {
            code = i.ToString();
            // etc, etc
        }
        // ----- This block must remain to pass ----
        if (code === combination) {
            console.log("You have unlocked the safe");
            return code;
        }
        else {
            code = ControlCode;
        }
    }
    // ----- This block must remain to pass ----

    return code; // failed
}
 */

const DEFAULT_TEMPLATE = `// -- Safe Game: open the safe to get the door key.
// Objective: brute-force a 3-digit code (000..999) to unlocks the safe.
// The 'combination' variable has been set by the game (e.g. 111).
// Return the correct code before the clock runs out to unlock the safe and move to the next puzzle
// May the coding Gods have mercy on your soul ---------|||

function buteForce() {
    // ...your code goes here
    // hint-1 zero-pad to 3 digits if you want to print: i.toString().padStart(3, "0")
    // ----- This block must remain to pass ----
    if (code === combination) {
        console.log("You have unlocked the safe");
        return code;
    }
    else {
        code = ControlCode;
    } 
    // ----- This block must remain to pass ----
    
    return code; // failed
}
`;

export default function CodingRacesPage(props: { stage?: Stage; combination?: number; timeLimitMs?: number }) {
    // If using app router:
    // const params = useParams() as { stage: Stage };
    // const stage = (params?.stage ?? props.stage ?? "safe") as Stage;

    // If using React Router
    // const { stage: routeStage } = usePrams();
    // const stage = (routeStage as Stage) ?? (pros.stage ?? "safe");

    const stage = (props.stage ?? "safe") as Stage; // fallback code to remove if we're including router params later
    const combination = props.combination ?? 488; // Safe combo ** This needs to be randomly generated eventually
    const timeLimitMs = props.timeLimitMs ?? 3000; // worker method hard timeout

    // --------- Timer ---------
    const [elapsedMs, setElapsedMs] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const timerRef = useRef<number | null>(null);
    const tickRef = useRef<number | null>(null);

    const startTimer = () => {
        if (timerRunning) return;
        setTimerRunning(true);
        const startAt = performance.now() - elapsedMs;
        tickRef.current = window.setInterval(() => {
            setElapsedMs(performance.now() - startAt);
        }, 50) as unknown as number;
    };
    const pauseTimer = () => {
        if (!timerRunning) return;
        setTimerRunning(false);
        if (tickRef.current != null) {
            clearInterval(tickRef.current);
            tickRef.current = null;
        }
    };
    const resetTimer = () => {
        pauseTimer();
        setElapsedMs(0);
    };

    useEffect(() => {
        return() => {
            if (tickRef.current != null) clearInterval(tickRef.current);
            if (timerRef.current != null) window.clearTimeout(timerRef.current);

        }
    }, []);

    // --------- Editor & Output ---------
    const [code, setCode] = useState(DEFAULT_TEMPLATE); // gets the template code
    const [status, setStatus] = useState<RunStatus>("idle");
    const [output, setOutput] = useState<string>("(terminal ready)\n");
    const [result, setResult] = useState<number | null>(null);


    // --------- Worker Sandbox ---------
    const workerUrl = useMemo(() => {
        // Build a mini worker
        // - can input the code and combination
        // - use it to captuer the console output
        // - executes the code.

        const workerSource = `
            self.onmessage = (evt) => {
                const { code, combination  } = evt.data || {};
                // mimimal conosle
                const logs = []'
                const send = (m) => self.postMessage(m);
                const console = { log: (...args) => send({ type: "log", data: args.map(String).join(" ") }) };
                 
                 try {
                    // Provide 'combination' and 'console' in scope
                    const wrapped = new Function("combination", code + "\\n;return (typeof bruteForce==='function') ? bruteForce() : (function(){throw new Error('No bruteForce() found');})();");
                    const res = wrapped(combination, console);
                    send({ type: "done", result: res });
                 } catch (err) {
                    send({ type: "error", error: String(err && err.message ? err.message : err) });
                 }
            };
        `;
        const blob = new Blob([workerSource], {type: "application/javascript"});
        return URL.createObjectURL(blob);
    }, []);

    const runCode = () => {
        // reset terminal + state
        setOutput("(running...)\n");
        setStatus("running");
        setResult(null);

        // Start manual time if not running
        if (!timerRunning) startTimer();

        const worker = new Worker(workerUrl);

        const cleanup = (finalStatus: RunStatus) => {
            worker.terminate();
            setStatus(finalStatus);
        };

        worker.onmessage = (e) => {
            const msg = e.data || {};
            if (msg.type === "log") {
                setOutput((prev) => prev + msg.data + "\n");
            } else if (msg.type === "done") {
                const val = Number(msg.result);
                setResult(val);
                if (val === combination) {
                    setOutput((prev) => prev + `✅ Correct code: ${val}\n`);
                    // Mark the stage as solved for safe -- Escape Room Menu
                    localStorage.setItem("escapeRoomSolvedStage", stage);
                    cleanup("success");
                    pauseTimer();
                } else {
                    setOutput((prev) => prev + `❌ Returned ${val}: expected ${combination}\n`);
                }
            } else if (msg.type === "error") {
                setOutput((prev) => prev + `💥 Error: ${msg.error}\n`);
                cleanup("error");
            }
        };


        // Hard timeout (to prevent any inifinite looping)
        timerRef.current = window.setTimeout(() => {
            setOutput((prev) => prev + "⏱️ Timed out.\n");
            cleanup("timeout");
        }, timeLimitMs) as unknown as number;

        // Kick off run
        worker.postMessage({ code, combination });
    };

    // --------- UI ---------
    const hhmmss = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
    };


    // **************************************
    // ************ PRESENTATION ************
    // **************************************
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <header className={"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"}>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">Coding Races - {stage.toUpperCase()} Stage</h1>
                        <p className="text-xs opacity-70">
                            Write code that finds the 3-digit combo. Preset <code>combination</code> is available to your code.
                        </p>
                    </div>

                    {/* Manual Timer */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm tabular-nums bg-zinc-900/70 border border-zinc-800 rounded px-2 py-1">
                            {hhmmss(elapsedMs)}
                        </span>
                        {!timerRunning ? (
                            <button className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600" onClick={startTimer}>
                                Start Countdown Timer
                            </button>
                        ) : (
                            <button className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500" onClick={pauseTimer}>
                                Pause Countdown Timer
                            </button>
                        )}
                        <button className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={resetTimer}>
                            Reset Countdown Timer
                        </button>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Editor */}
                    <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-medium">Editor</h2>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="opacity-70">Combination:</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">{combination}</span>
                            </div>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            className="w-full h-64 md:h-[28rem] font-mono text-sm leading-5 bg-zinc-950 text-zinc-100 rounded-lg border border-zinc-800 p-3 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <div className="mt-3 flex items-center gap-2">
                            <button onClick={runCode} className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500">
                                Run
                            </button>
                            <button
                                onClick={() => setCode(DEFAULT_TEMPLATE)}
                                className="px-3 py-1 rounded bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                            >
                                Reset Template
                            </button>
                            <span className="text-sx opacity-60">Time limit: {timeLimitMs} ms</span>
                        </div>
                    </div>

                    {/* Terminal Window */}
                    
                </div>
            </div>
        </div>
    )
}
