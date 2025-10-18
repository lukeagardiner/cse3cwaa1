//app/api/player/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Player, Progress } from "../models";

export async function POST(req: Request) {
    try {
        const { playerId, password } = await req.json();

        if (!playerId || !password) {
            return NextResponse.json({ error: "player id / email and password are required" }, { status: 400 });
        }

        const exists = await Player.findByPk(playerId);
        if (exists) {
            return NextResponse.json({ error:"Player already exists" }, {status: 409 } );
        }

        // Detect if a provided playerId is an email and store it in the email field if so
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(playerId);
        const email = isEmail ? playerId : null;

        const passwordHash = await bcrypt.hash(password, 10);
        const player = await Player.create({ playerId, email, passwordHash }); // Adds the hash only
        await Progress.create({ playerId: player.playerId, safe: false, key: false, door: false });

        return NextResponse.json({ success: true, playerId: player.playerId });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Registration process failed"}, {status: 500});
    }
}
