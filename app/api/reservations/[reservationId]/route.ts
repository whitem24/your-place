import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    reservationId: string
}

export async function DELETE(request:Request, { params }: { params:IParams }) {
    
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
        throw new Error("Invalid Id");    
    }

    const reservation = await prisma.reservation.deleteMany({
        where :{
            id : reservationId,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } } //This OR because who is able to delete is the creator of reservation or the creator of the listing
            ]
        }
    });

    return NextResponse.json(reservation);
}