//app/api/player/save/route/ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Player, Progress } from "../models";

export async function POST(req: Request) {
    try {
        const { playerId, password, progress } = await req.json();

        if (!playerId || !password || !progress) {
            return NextResponse.json({ error: "player id / email, password and progress package required"}, { status: 400});
        }

        let player = await Player.findByPk(playerId);

        // **************************************
        // ******* REGISTRATION AND LOGIN *******
        // *************** BLOCK ****************
        // **************************************
        if (!player) {
            // if player record doesn't already exist and inputs are valid - create players
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(playerId);
            const email = isEmail ? playerId : null;
            const passwordHash = await bcrypt.hash(password, 10);
            player = await Player.create({ playerId, email, passwordHash });
            await Progress.create({ playerId, safe: false, key: false, door: false });
        } else {
            // confirm if a valid password for existing player has been sent.
            const auth = await player.validPassword(password);
            if (!auth) {
                return NextResponse.json({ error: "Login and save failed with credentials provided. Check provided details before trying again."}, { status: 401});
            }
        }

        // ------- UPDATE / INSERT PROGRESS -------
        const row = await Progress.findOne({ where: { playerId } }); // Id's are unique but protect against handling multiple
        if (!row) {
            await Progress.create({ playerId, ...progress });
        } else {
            await row.update({ ...progress });;
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "save operation failed" }, { status: 500 });
    }
}