import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {

    let email = '';
    let password = '';

    try {
        const body = await req.json();
        email = body.email;
        password = body.password;
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    if (!email || !password) {
        return NextResponse.json({ error: "Email and passwords are requid" }, { status: 400 })
    }

    const Existinguser = await prisma.user.findUnique(
        { where: { email } }
    )

    if (Existinguser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = await prisma.user.create({
        data: {
            email,
            password
        }
    })

    return NextResponse.json({ user, Message: "User created" }, { status: 201 })
}
