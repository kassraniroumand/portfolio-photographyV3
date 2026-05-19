import {prisma} from "@/lib/prisma";

const SINGLETON_ID = "singleton";

export async function GET() {
    const record = await prisma.siteContent.findUnique({
        where: { id: SINGLETON_ID },
    });

    return Response.json(record ?? { id: SINGLETON_ID, data: null });
}