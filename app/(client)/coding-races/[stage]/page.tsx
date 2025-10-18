"use client"
//app/(client)/coding-races/[stage]/page.tsx

import React from "react";
import { useParams, notFound } from "next/navigation";

import SafePuzzle from "@/app/Components/CodingRaces/SafePuzzle";
import KeyPuzzle from "@/app/Components/CodingRaces/KeyPuzzle";
//import DoorPuzzle from "@/app/Components/CodingRaces/DoorPuzzle";
//import DoorPuzzle from "@/Components/coding-races/DoorPuzzle"; // incorrect route

type Stage = "safe" | "key" | "door";

export default function CodingRacesRoute() {
    const { stage: raw } = useParams<{stage: string}>();
    const stage = (raw ?? "safe") as Stage;

    if (!["safe", "key", "door"].includes(stage)) {
        notFound()
    }

    // Pass shared logic/props here (optional)
    const commonProps = {
        onComplete: () => {
            localStorage.setItem("escapeRoomSolvedStage", stage);
            alert(`You solved the ${stage.toUpperCase()} puzzle`);
        },
    };

    switch (stage) {
        case "safe":
            return <SafePuzzle {...commonProps} />;
        case "key":
            return <KeyPuzzle
                timeLimitMs={6000}
                {...commonProps} />;
  /*    // key refactored to allow for random generation
        case "key":
            return <KeyPuzzle
                binaryKey="1011 0100 1110 1111  1001 1101 0010 0110  0001 1110 1011 0111"
                timeLimitMs={6000}
                {...commonProps} />;
        case "door":
            return <DoorPuzzle  {...commonProps} />; */
        default:
            notFound();
    }
}