// coding-races/page.tsx

"use client"
import React, { useEffect, useMemo, useRef, useState } from "react";
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
    if (code === Combination) {
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
}
