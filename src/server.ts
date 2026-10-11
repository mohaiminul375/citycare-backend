import app from "./app"
import config from "./config"
import { prisma } from "./lib/prisma";

const port = config.port;
const main = async () => {
    try {
        await prisma.$connect();
        console.log('Prisma connected and working');
        app.listen(port, () => {
            console.log(`rent-nest server running on port:${port}`)
        })
    } catch (error) {
        console.error("Error is starting the server:", error);
        // await prisma.$disconnect();
        process.exit(1);
    }
}
main()