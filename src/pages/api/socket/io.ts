import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/src/types/socket";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on("connection", (socket) => {
            console.log('Client connected:', socket.id);

            // Join a conversation room
            socket.on('join-conversation', (conversationId) => {
                socket.join(`conversation:${conversationId}`);
                console.log(`Socket ${socket.id} joined conversation:${conversationId}`);
            });

            // Leave a conversation room
            socket.on('leave-conversation', (conversationId) => {
                socket.leave(`conversation:${conversationId}`);
                console.log(`Socket ${socket.id} left conversation:${conversationId}`);
            });

            // Send message
            socket.on('send-message', (data) => {
                io.to(`conversation:${data.conversationId}`).emit('new-message', data.message);
            });

            // Typing indicator
            socket.on('typing', (data) => {
                socket.to(`conversation:${data.conversationId}`).emit('user-typing', data.userId);
            });

            socket.on('stop-typing', (data) => {
                socket.to(`conversation:${data.conversationId}`).emit('user-stop-typing', data.userId);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;
