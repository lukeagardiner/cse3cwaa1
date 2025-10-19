//app/api/player/login/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { Player, ensureDbSynced } from "../models"

export async function POST(req: Request) {
    try {
        await ensureDbSynced();
        const { playerId, password } = await req.json();

        if (!playerId || !password) {
            return NextResponse.json({ error: "player id and password are required"}, { status: 400 });
        }

        const player = await Player.findByPk(playerId); // primary key find
        if (!player) {
            NextResponse.json({ error: "user not found"}, { status: 404 });
        }

        const valid = await player?.validPassword(password);
        if (!valid) {
            NextResponse.json({ error: "invalid password"}, { status: 401 });
        }

        return NextResponse.json({ success: true, playerId: player?.playerId });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "login failed"}, { status: 500 });
    }
}
