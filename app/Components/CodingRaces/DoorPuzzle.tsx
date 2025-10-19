"use client"
// app/Components/DoorPuzzle.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Stage = "safe" | "key" | "door";
type RunStatus = "idle" | "running" | "success" | "error" | "timeout";

type Props = {
    stage?: Stage;
    doorsCount?: number;
    timeLimitMs?: number;
    onComplete?: () => void;
};

/*
function generateRandomBinaryString(length = 48): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += Math.random() > 0.5 ? "1" : "0";
        if ((i + 1) % 4 === 0 && i < length - 1) result += " ";
    }
    return result;
}
*/


// TODO
// we want a minimum timer on this one as it can't expire any sooner than it takes to run all the combinations
// set a minimum length etc
// add a answer page for testing
// debug some existing code - user is being told door 4 is the exit door when they run the code they're give, but there is a bug in the code
// the correct answer is actually a different door should be a different door.

// Most basic example without extended conditions above
/*
//TBC
function convertToHex(bin) {
    const stripInput = String(bin).replace(/\s+/g, "");
    if (!stripInput) return "";
    // check for 01 only
    if (!/^[01]+$/.test(stripInput)) {
        throw new Error("Input contains non-binary characters.");
    }
    // handle padding
    const padded = stripInput.length % 4 === 0
        ? stripInput
        : stripInput.padStart(Math.ceil(stripInput.length / 4) * 4, "0");
        // convert every block to a hex digit
        let hex = "";
        for (let i = 0; i < padded.length; i += 4) {
            const block = padded.slice(i, i + 4);
            const value = parseInt(block, 2);
            hex += value.toString(16);
        }

        return hex.toUpperCase();
}

// --------- Compute Expected Hex Answer ---------
function computeExpectedHexAnswerKey(binaryKey: string): string {
    const clean = binaryKey.replace(/\s+/g,"");
    if (!/^[01]+$/.test(clean)) {
        throw new Error("Compute Error: binaryKey input contains non-binary characters");
    }
    // pad to multiple of 4 chars on the left
    const padded = clean.length % 4 === 0 ? clean : clean.padStart(Math.ceil(clean.length / 4) * 4, "0");
    // convert to hex (uppercase) without 0x
    let hex = "";
    for (let i = 0; i < padded.length; i += 4)  {
        const block = padded.slice(i, i + 4);
        const value = parseInt(block, 2);
        hex += value.toString(16);
    }
    return hex.toUpperCase();
}
*/


// --------- Game Player Instruction and Template ---------
const DEFAULT_TEMPLATE = `// ==== Key Game: Fix the bug to find the real exit door ===
// You broke into the safe and you now have a key code for the door to escape. Just one 
// problem, the escape room door keypad is hexadecimal your key is in binary. 
// Implement convertToHex(bin) to convert the binary key & return UPPERCASE hex STRING (no "0x").
// --Notes:
// - \`bin\` may contain spaces - clean if needed
// - if length isn't a multiple of 4 you may - you may need to adjust the padding 
// - Return HEX in UPPERCASES with no spaces to unlock the next stage... and be quiet, or you may wake Bert up.

function convertToHex(bin) {
    // ...your code goes here
    // return "...";
}
`;

export default function KeyPuzzle({
                                      stage: stageProp,
                                      //binaryKey = "1010 0111 0010 1111 1100 1001 0001 1010  1111 0001 0010 1010", // needs to be random later
                                      //binaryKey = generateRandomBinaryString(48), // refactored
                                      binaryKey, // refactored again
                                      timeLimitMs = 5000, // worker method hard timeout
                                      onComplete,
                                  } : Props ) {
    // refactored binaryKeyGen
    const [randomKey, setRandomKey] = useState<string>(() => generateRandomBinaryString(48));
    const finalBinaryKey = binaryKey ?? randomKey;
    // existing
    const params = useParams() as { stage?: Stage };
    const stage = (params?.stage ?? stageProp ?? "key") as Stage;

    // --------- Timer ---------
    const [elapsedMs, setElapsedMs] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const hardTimeoutRef = useRef<number | null>(null);
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
            //clearInterval(tickRef.current);
            window.clearInterval(tickRef.current!)
            tickRef.current = null;
        }
    };
    const resetTimer = () => {
        pauseTimer();
        setElapsedMs(0);
    };

    useEffect(() => {
        return () => {
            if (tickRef.current != null) window.clearInterval(tickRef.current);
            if (hardTimeoutRef.current != null) window.clearTimeout(hardTimeoutRef.current);
        };
    }, []);

    // --------- Editor & Output ---------
    const [code, setCode] = useState(DEFAULT_TEMPLATE); // gets the template code
    const [status, setStatus] = useState<RunStatus>("idle");
    const [output, setOutput] = useState<string>("(terminal ready)\n");
    // const [result, setResult] = useState<number | null>(null);

    // Calculate expected and don't show to user
    const [expectedHexKey, setExpectedHexKey] = useState<string>("");
    useEffect(() => {
        try {
            //setExpectedHexKey(computeExpectedHexAnswerKey(binaryKey));
            setExpectedHexKey(computeExpectedHexAnswerKey(finalBinaryKey));
        } catch (e: any) {
            setExpectedHexKey(""); // Invalid internal input -- shouldn't happen but let player continue to show error at compare step
            console.log("Logic Error: Invalid pre-compute on internal input");
        }
        //}, [binaryKey]);
    }, [finalBinaryKey]);


    // --------- Worker Sandbox ---------
    const workerUrl = useMemo(() => {
        // Build a mini worker
        // - mostly retains same structure as Safe Puzzle implementation
        // - ideally parametise the structure on reusable parts

        const workerSource = `
            self.onmessage = (evt) => {
            const { code, binaryKey } = evt.data || {};  // Modified variables
            const send = (m) => self.postMessage(m);
            const console = { log: (...args) => send({ type: "log", data: args.map(String).join(" ") }) };

            try {
                const wrapped = new Function(
                    "binaryKey", // Modified variable / label
                    "console",
                    code + "\\n; if (typeof convertToHex !== 'function') { throw new Error ('No convertToHex(bin) function found'); } return convertToHex(binaryKey);"
                );
                const result = wrapped(binaryKey, console);
                send({ type: "done", result });
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
        //setResult(null);

        // Start manual time if not running
        if (!timerRunning) startTimer();

        const worker = new Worker(workerUrl);

        const cleanup = (finalStatus: RunStatus) => {
            if (hardTimeoutRef.current != null) {
                window.clearTimeout(hardTimeoutRef.current);
                hardTimeoutRef.current = null;
            }
            worker.terminate();
            setStatus(finalStatus);
            if (finalStatus === "success") pauseTimer();
        };

        worker.onmessage = (e) => {
            const msg = e.data || {};
            if (msg.type === "log") {
                setOutput((prev) => prev + msg.data + "\n");
            } else if (msg.type === "done") {
                const val = String(msg.result ?? "");
                // Comparison happens in main thread to avoid exposing expected value/logic in player view
                if (!expectedHexKey) {
                    setOutput((prev) => prev + `💥 Logic Error: expected value not correctly set.\n`);
                    cleanup("error");
                    return;
                }
                // Clean player output (remove spaces, set uppercase
                const normalised = val.replace(/\s+/g, "").toUpperCase();
                if (normalised === expectedHexKey) {
                    setOutput((prev) => prev + `✅ Correct code. Door key recoded to HEX. Nice!\n`);
                    //localStorage.setItem("escapeRoomSolvedStage", "key");
                    localStorage.setItem("escapeRoomSolvedStage", stage);
                    onComplete?.();
                    cleanup("success");
                } else {
                    setOutput((prev) => prev + `❌ Answer is no good. Returned ${val}: expected ${expectedHexKey}\n`);
                    cleanup("error");
                }
            } else if (msg.type === "error") {
                setOutput((prev) => prev + `💥 Error: ${msg.error}\n`);
                cleanup("error");
            }
        };

        // Hard timeout (to prevent any inifinite looping)
        hardTimeoutRef.current = window.setTimeout(() => {
            setOutput((prev) => prev + "⏱️ Timed out.\n");
            cleanup("timeout");
        }, timeLimitMs) as unknown as number;

        // Kick off run
        worker.postMessage({ code, binaryKey: finalBinaryKey });
    };

    // --------- UI helper calcs ---------
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
                            Write the code that converts the binary door key to an uppercase HEX key as a string (no spaces, no "0x").
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
                                <span className="opacity-70">Binary Key:</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">{finalBinaryKey}</span>
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
                                onClick={() => {
                                    setCode(DEFAULT_TEMPLATE)
                                    setRandomKey(generateRandomBinaryString(48));
                                    setOutput("(terminal ready)\n");
                                    setStatus("idle");
                                    setElapsedMs(0);
                                }}
                                className="px-3 py-1 rounded bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                            >
                                Reset Template
                            </button>
                            <span className="text-sx opacity-60">Time limit: {timeLimitMs} ms</span>
                        </div>
                    </div>

                    {/* Terminal Window */}
                    <div className="p-3 rounded-xl border boder-zinc-800 bg-zinc-900/60">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-medium">Terminal</h2>
                            <span
                                className={`text-xs px-2 py-0.5 rounded border ${
                                    status === "running"
                                        ? "border-amber-500 text-amber-300"
                                        : status === "success"
                                            ? "border-emerald-600 text-emerald-300"
                                            : status === "error"
                                                ? "border-rose-600 text-rose-300"
                                                : status === "timeout"
                                                    ? "border-yellow-700 text-yellow-300"
                                                    : "border-zinc-700 text-zinc-400"
                                }`}
                            >
                                {status.toUpperCase()}
                            </span>
                        </div>
                        <pre className="h-64 md:h-[28rem] overflow-auto rounded-lg bg-black/80 text-green-300 p-3 text-xs leading-5">
                            {output}
                        </pre>
                        {status === "success" && (
                            <div className="mt-2 text-xs text-emerald-300">
                                Hex accepted. Progress saved. Return to escape room to find your next puzzle.
                            </div>
                        )}
                    </div>
                </div>

                {/* Hints + Instructions */}
                <div className="mt-4 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs leading-5">
                    <details>
                        <summary className="cursor-pointer font medium">Hints</summary>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Remove spaces from the input.</li>
                            <li>If the length isn't a multiple of 4, decide how to handle the left-padding with zeros.</li>
                            <li>Convert groups of 4 bits to a single hex digit (0-F).</li>
                            <li>Return an UPPERCASE hex string with no spaces, no "0x".</li>
                            <li>Your code will be tested against different inputs, it should be capable of converting any provided binary.</li>
                        </ul>
                    </details>
                </div>
            </div>
        </div>
    );
}
