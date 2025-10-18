"use client"
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Escape room menu
 * - Add responsive layout with clickable zones
 * - Alternative background images for state vairants
 * - Zones are identified in percentages so they scale with image
 * - Keyboard accessible and optional debug / dev mode outlines
 */

// ----- Types

type BgState = "base" | "safeSolved" | "keySolved" | "doorSolved";
// for tracking where the user is up to
type Stage = "safe" | "key" | "door";
type Progress = { safe: boolean; key: boolean; door: boolean; updatedAt?: number };

// const navigate = useNavigate();

// ########## Action Card Definition ##########
function ActionCard({ title, onClick }: { title: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-4 rounded-lg border border-zinc-700/80 bg-zinc-900/60 hover:bg-zinc-800 transition shadow"
        >
            <div className="text-sm font-medium">{title}</div>
            <div className="flex items-center gap-2">Click to navigate or bind a route</div>
        </button>
    );
}

export default function EscapeRoom() {
    const router = useRouter();
    const images = useMemo(() => ({
        base: "/images/escape-room/base.png",
        safeSolved: "/images/escape-room/safesolved.png",
        keySolved: "/images/escape-room/keysolved.png",
        doorSolved: "/images/escape-room/doorsolved.png",
    }), []);

    // Variables also used in game stage management
    const [bgState, setBgState] = useState<BgState>("base");
    const [debugMode, setDebugMode] = useState(false);
    const [playerId, setPlayerId] = useState<string>(""); // Allows for any future type rn
    const [progress, setProgress] = useState<Progress>({safe: false, key: false, door: false});
    const [saving, setSaving] = useState<boolean>(false);


    // ########## Progress persistence helpers ##########
    const LS_KEY = "escaperRoomProgress"; // LocalStorageKey
    const loadProgress = useCallback((): Progress => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return {safe: false, key: false, door: false};
            const p = JSON.parse(raw); //progress
            return {safe: !!p.safe, key: !!p.key, door: !!p.door, updatedAt: p.updatedAt || Date.now()};
        } catch {
            return {safe: false, key: false, door: false};
        }
    }, [LS_KEY]);

    const persistProgress = useCallback((p: Progress) => {
        const withTs = {...p, updatedAt: Date.now()};
        localStorage.setItem(LS_KEY, JSON.stringify(withTs));
        setProgress(withTs);
    }, [LS_KEY]);

    useEffect(() => {
        persistProgress(loadProgress());
    }, [persistProgress, loadProgress]);

    // ########## Visual state helper based on progress ##########
    useEffect(() => {
        // Control background based on game progress
        if (progress.door) setBgState("doorSolved");
        else if (progress.key) setBgState("keySolved");
        else if (progress.safe) setBgState("safeSolved");
        else setBgState("base");
    }, [progress.safe, progress.key, progress.door]);

    // ----- Enforcing stage order -----
    const canBegin = (stage: Stage) => {
        if (stage === "safe") return true; // Must occur first
        if (stage === "key") return progress.safe; // Safe must be before key
        if (stage === "door") return progress.key; // Key must be before door
        return false
    };

    // ----- Stage entry control to navigate to coding-races -----
    const beginStage = (stage: Stage) => {
        if (!canBegin(stage)) return;
        // Update backrground to simulate beginning stage if enough graphics
        if (stage === "safe") setBgState("safeSolved");
        if (stage === "key") setBgState("keySolved");
        if (stage === "door") setBgState("doorSolved");

        // React Router usage placeholder
        // navigate(`/coding-races/${stage}`/};
        // Alternative is callback/dispatch to game shell or dynamic puzzle load
        // alert(`Enter stage:  ${stage} → load Coding Races`); // Replaced when implementing dynamic puzzle routing
        router.push(`/coding-races/${stage}`);
    }

    // ----- After a stage puzzle from coding-races is solved
    // e.g.
    //    window.localStorage.setItem("escapeRoomSolvedStage", stage)
    //    could have a function through app state manager as well if external user state controls exist
    // Temp
    // button control to simmulate completion -- remove this later
    const markSolved = useCallback((stage: Stage) => {
        const p = {...progress};
        if (stage === "safe") p.safe = true;
        if (stage === "key" && p.safe) p.key = true;
        if (stage === "door" && p.key) p.door = true; // game finished
        persistProgress(p);
    }, [progress, persistProgress]);

    // #####****** OPTIONAL - EXTERNAL STORAGE EVENTS LISTENER... THIS SHOULD BE PUSHED TO API ******#####
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === LS_KEY) setProgress(loadProgress());
            if (e.key === "escapeRoomSolvedStage" && e.newValue) {
                markSolved(e.newValue as Stage);
                localStorage.removeItem("escapeRoomSolvedStage"); // Escape room progress?
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [loadProgress, markSolved]);

    // ########## DB Save will eventually get called here via API ##########
    async function saveProgressLogic() {
        try {
            setSaving(true);
            // TODO
            // -- Insert API endpoint and auth handling
            // POST BODY PLACEHOLDER ONLY
            // May need to handle guest sessions etc...
            // Consider using tokenised session logic like in previous app
            const payload = {
                playerId: playerId || undefined,
                progress,
            };
            // const res = await fetch("/api/progress/save", {
            //   method: "POST",
            //   headers: { "Content-Type": "apllication/json" },
            //   body: JSON.stringify(payload),
            // });
            // if (!res.ok) throw new Error(`HTTP ${res.status}`);
            // const json = await res.json();
            console.log("mock) saving player progress session to DB storage: ", payload);
            alert("Progress saved (mock). Replace with real API call.");
        } catch (err: any) {
            console.error(err)
            alert("Porgress failed to save. See output log for error detail.");
        } finally {
            setSaving(false);
        }
    }

    // Clickable zones (based on percentages for scaling / responsiveness)
    // Need to come back to these to do some edits
    // Add disable state and tool tips to manage progress...
    // Original
    /*
    const zones: Array<{
        id: "safe" | "key" | "doors";
        label: string;
        // percentages [0..100]
        left: number;
        top: number;
        width: number;
        height: number;
        onClick: () => void;
    }> = [{
        id: "safe",
        label: "Safe (Combination Game)",
        left: 3,
        top: 45,
        width: 22,
        height: 35,
        onClick: () => setBgState((s) => ( s === "base" ? "safeSolved" : s))
    },
    {

    }
    ]
    */
    // Refactor
    const zones: Array<{
        id: Stage | "keys" | "doors";
        stage?: Stage;
        label: string;
        // percentages [0..100]
        left: number;
        top: number;
        width: number;
        height: number;
    }> = [
        {id: "safe", stage: "safe", label: "Safe - Combination Puzzle", left: 3, top: 45, width: 22, height: 35},
        {id: "key", stage: "key", label: "Key - Conversion Puzzle", left: 40, top: 64, width: 20, height: 22},
        {id: "door", stage: "door", label: "Door - Debug Puzzle", left: 68, top: 28, width: 28, height: 62},
    ];

    // make sure correct background is being displayed
    const currentSrc = images[bgState];

    return (
        <div className="w-full min-h-screen bg-zinc-900 text-zinc-100 py-6">
            <div className="max-w-6xl mx-auto px-4">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-xl sm:text-2xl font-semibold">Escape Room - Interactive Layout</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="opacity-70">GameState:</span>
                        <select
                            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1"
                            value={bgState}
                            onChange={(e) => setBgState(e.target.value as BgState)}
                        >
                            <option value="base">Base</option>
                            <option value="safeSolved">Safe Open</option>
                            <option value="keySolved">Safe Open + Key Recoded</option>
                            <option value="doorSolved">Safe Open + Key Recoded + Door Open</option>
                        </select>
                        {/* reminder - react switch-state code below in onclick  */}
                        <button
                            className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"
                            onClick={() => setDebugMode((v) => !v)}
                        >
                            {debugMode ? "Hide Outlines" : "Show Outlines"}
                        </button>
                    </div>
                </header>

                {/* Setup background with overlayed zones */}
                <div className="relative w-full max-w-5xl mx-auto" style={{aspectRatio: "1 / 1"}}>
                    <img
                        src={currentSrc}
                        alt="Escape Room Background"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
                        draggable={false}
                    />

                    {zones.map((z) => {
                        const enabled = z.stage ? canBegin(z.stage) : true;
                        return (
                            <button
                                key={z.id}
                                aria-label={z.label}
                                title={enabled ? z.label : `${z.label} (stage locked: complete previous stage)`}
                                disabled={!enabled}
                                onClick={() => z.stage && beginStage(z.stage)}
                                className={
                                    "group absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed"
                                }
                                style={{
                                    left: `${z.left}%`,
                                    top: `${z.top}%`,
                                    width: `${z.width}%`,
                                    height: `${z.height}%`,
                                    cursor: enabled ? "pointer" : "not-allowed",
                                    background: debugMode
                                        ? "rgba(255, 200, 0, 0.15)"
                                        : enabled
                                            ? "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0))"
                                            : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0))",
                                    border: debugMode ? "2px dashed rgba(255,200,0,0.6)" : "none",
                                    borderRadius: "8px",
                                    transition: "box-shadow 160ms ease, transform 160ms ease, opacity 160ms ease",
                                    opacity: enabled ? 0 : 0.6,
                                }}
                                onKeyDown={(e) => {
                                    if ((e.key === "Enter" || e.key === " ") && enabled) {
                                        e.preventDefault();
                                        z.stage && beginStage(z.stage);
                                    }
                                }}
                            >
                                <span
                                    className="pointer-events-none block w-full h-full rounded-lg opacity-0 group-hover:opacity-100"
                                    style={{
                                        boxShadow: "0 0 0 3px rgba(255,200,0,0.2) inset, 0 0 24px rgba(255,200,0,0.2)",
                                        transition: "opacity 160ms ease",
                                    }}
                                />
                            </button>
                        )
                    })}
                </div>

                {/* Actions and Debug Helpers */}
                <div className={"mt-4 grid gap-3 sm:grid-cols-3"}>
                    <ActionCard title="Safe - Combination Puzzle" onClick={() => beginStage("safe")}/>
                    <ActionCard title="Key - Conversion Puzzle" onClick={() => beginStage("key")}/>
                    <ActionCard title="Door - Debugging Puzzle" onClick={() => beginStage("door")}/>
                </div>

                {/* Progress Controls */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border border-zinc-700/80 bg-zinc-900/60">
                        <h2 className="text-sm font-medium mb-2">Progress</h2>
                        <div className="text-xs opacity-80">
                            <div>Safe: {progress.safe ? "✔" : "✖"} &nbsp; Key: {progress.key ? "✔" : "✖"} &nbsp; Door: {progress.door ? "✔" : "✖"}</div>
                            <div
                                className="mt-3 flex flex-wrap gap-2 text-xs">Updated: {progress.updatedAt ? new Date(progress.updatedAt).toLocaleString() : "—"}</div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <button className="px-3 py-1 rounded bg-emerald-700/70 hover:bg-emerald-700"
                                    onClick={() => markSolved("safe")}>Mark Safe Solved
                            </button>
                            <button className="px-3 py-1 rounded bg-emerald-700/70 hover:bg-emerald-700"
                                    onClick={() => markSolved("key")} disabled={!progress.safe}>Mark Key Solved
                            </button>
                            <button className="px-3 py-1 rounded bg-emerald-700/70 hover:bg-emerald-700"
                                    onClick={() => markSolved("door")} disabled={!progress.key}>Mark Door Solved
                            </button>
                            <button className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700"
                                    onClick={() => persistProgress({safe: false, key: false, door: false})}>Reset
                                Progress
                            </button>
                            <button className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700"
                                    onClick={() => persistProgress(loadProgress())}>Load Progress
                            </button>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border border-zinc-700/80 bg-zinc-900/60">
                        <h2 className="text-sm font-medium mb-2">Save to Database (placeholder)</h2>
                        <div className="flex items-center gap-2">
                            <input
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                placeholder="Player Id / Email"
                                className="flex-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm"
                            />
                            <button
                                onClick={saveProgressLogic}
                                className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-60"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Progress"}
                            </button>
                        </div>
                        { /*
                        <p className="mt-4 text-xs opacity-70">
                            Add for React Router :
                            call <code>navigate(`/coding-races/${"safe" | "key" | "door"}`)</code> inside <code>beginStage()</code>.
                            After a puzzle is solved, set
                            <code>localStorage.setItem("escapeRoomSolvedStage", stage)</code> in the Coding Races Page
                            so this menu updates automatically.
                        </p>
                        */ }
                    </div>
                </div>
            </div>
        </div>
    );
}

