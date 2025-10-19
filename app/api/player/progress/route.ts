//app/api/player/progress/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { Player, Progress } from "../models";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const playerId = searchParams.get("playerId");
        const password = searchParams.get("password");

        if (!playerId || !password) {
            return NextResponse.json({ error: "player id / email and password are required" }, { status: 400 });
        }

        const player = await Player.findByPk(playerId); // Primary key find
        if (!player) return NextResponse.json({ error: "unable to retrieve progress with credentials provided" }, { status: 404});

        const auth = await player.validPassword(password);
        if (!auth) return NextResponse.json({ error: "unable to retrieve progress with credentials provided" }, { status: 401});

        const prog = await Progress.findOne({ where: { playerId }});
        return NextResponse.json({ success: true, progress: prog ?? {safe: false, key: false, door: false }});
    } catch (err) {
        // dump the retrieval error to console
        console.error(err);
    }
}