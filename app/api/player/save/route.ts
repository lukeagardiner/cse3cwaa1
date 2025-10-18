//app/api/player/save/route/ts

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
    }
}