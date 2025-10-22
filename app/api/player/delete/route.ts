//app/api/player/delete/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { Player, Progress, ensureDbSynced } from "../models";

// Refactoring to repair delete route behaviour
export async function DELETE(req: Request) {
    try {
        await ensureDbSynced();

        const contentType = req.headers.get("content-type") || "";
        let body: any = {};
        if (contentType.includes("application/json")) {
            body = await req.json().catch(() => ({}));
        } else {
            const { searchParams } = new URL(req.url);
            body = {
                playerId: searchParams.get("playerId"),
                password: searchParams.get("password"),
            };
        }

        const { playerId, password } = body || {};
        if (!playerId || !password) return NextResponse.json({ error: "invalid details provided for delete" }, { status: 400 });

        const player = await Player.findOne({ where: {playerId} });
        if (!player) return NextResponse.json({ error: "invalid details provided for delete" }, { status: 404 });

        const valid = await player.validPassword(password);
        if (!valid) return  NextResponse.json({ error: "invalid details provided", status: 401 });

        await Progress.destroy({ where: { playerId: playerId } });
        await player.destroy();

        // Make sure the next response is returned by the method - this was the source of the error previously
        // NextResponse.json({ success: "true", message: "player account delelted" });
        return NextResponse.json(
            { success: "true", message: "player account delelted" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error deleting account: ", err);
        return NextResponse.json({ error: "internal server error - error deleting account" }, { status: 500 });;
    }
}
