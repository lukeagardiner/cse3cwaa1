//app/api/player/delete/route.ts
import { NextResponse } from "next/server";
import { Player, Progress } from "../models";

export async function DELETE(req: Request) {
    try {
        const { playerId, password } = await req.json();
        if (!playerId || !password) return NextResponse.json({ error: "invalid details provided for delete" }, { status: 400 });

        const player = await Player.findOne({ where: {playerId} });
        if (!player) return NextResponse.json({ error: "invalid details provided for delete" }, { status: 404 });

        const valid = await player.validPassword(password);
        if (!valid) return  NextResponse.json({ error: "invalid details provided", status: 401 });

        await Progress.destroy({ where: { playerId: playerId } });
        await player.destroy();
        NextResponse.json({ success: "true", message: "player account delelted" });
    } catch (err: any) {
        console.error("Error deleting account: ", err);
        return NextResponse.json({ error: "internal server error - error deleting account" }, { status: 500 });;
    }
}
