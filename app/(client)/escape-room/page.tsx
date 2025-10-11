"use client"
import React, { useEffect, useMemo, useState } from "react";

/**
 * Escape room menu
 * - Add responsive layout with clickable zones
 * - Alternative background images for state vairants
 * - Zones are identified in percentages so they scale with image
 * - Keyboard accessible and optional debug / dev mode outlines
 */

export default function EscapeRoom() {
    const images = useMemo(() => ({
        base: "/images/escape-room/base.png",
        safeSolved: "/images/escape-room/safesolved.png",
        keySolved: "/images/escape-room/keysolved.png",
        doorSolved: "/images/escape-room/doorsolved.png",
    }), [])

    type BgState = "base" | "safeSolved" | "keySolved" | "doorSolved";
    // for tracking where the user is up to
    type Sage = "safe" | "key" | "door";
    type Progress = { safe: boolean; key: boolean; door: boolean; updatedAt?: number };

    // Variables also used in game stage management
    const [bgState, setBgState] = useState<BgState>("base");
    const [debugMode, setDebugMode] = useState(false);
    const [playerId, setPlayerId] = useState<string>(""); // Allows for any future type rn
    const [progress, setProgress] = useState<Progress>({ safe: false, key: false, door: false });
    const [saving, setSaving] = useState<boolean>(false);

    // ########## Progress persistence helpers ##########
    const LS_KEY = "escaperRoomProgress"; // LocalStorageKey
    const loadProgress = (): Progress => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return { safe: false, key: false, door: false };
            const p = JSON.parse(raw); //progress
            return { safe: !!p.safe, key: !!p.key, door: !!p.door, updatedAt: p.updatedAt || Date.now() };
        } catch {
            return { safe: false, key: false, door: false };
        }
    };
    const persistProgress = (p: Progress) => {
      const withTs = { ...p, updatedAt: Date.now() };
      localStorage.setItem(LS_KEY, JSON.stringify(withTs));
      setProgress(withTs);
    };

    useEffect(() => {
        persistProgress(loadProgress());
    }, []);

    // ########## Visual state helper based on progress ##########
    useEffect(() => {
        // Control background based on game progress
        if (progress.door) setBgState("doorSolved");
        else if (progress.key) setBgState("keySolved");
    })

    // Clickable zones (based on percentages for scaling / responsiveness)
    // Need to come back to these to do some edits
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
}