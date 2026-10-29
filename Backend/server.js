
import dns from "node:dns";

// Prefer IPv4 when resolving hostnames
dns.setDefaultResultOrder("ipv4first");

const startServer = async () => {
    try {
        // Import app only after DNS configuration
        const { default: app } = await import("./src/app.js");
        const { initSocket } = await import("./src/sockets/server.socket.js");
        const { default: connectDB } = await import("./src/config/database.js");

        const server = (await import("node:http")).createServer(app);

        await connectDB();

        initSocket(server);

        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error);
        process.exitCode = 1;
    }
};

startServer();
