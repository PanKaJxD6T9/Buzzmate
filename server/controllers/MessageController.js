import getPrismaInstance from "../utils/PrismaClient.js"
/* global onlineUsers */
import {renameSync} from "fs";

export const addMessage = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const {message, from, to} = req.body;
        const getUser = onlineUsers.get(to);
        if(message && from && to){
            const newMessage = await prisma.message.create({
                data: {
                    message,
                    sender: {connect: {id: parseInt(from)}},
                    receiver: {connect: {id: parseInt(to)}},
                    messageStatus: getUser ? "delivered" : "sent"
                },
                include: {
                    sender: true,
                    receiver: true
                },
            });
            return res.status(201).json({message: newMessage, success: true});
        }
        return res.status(400).json({message: "All fields are required", success: false});
    } catch (error) {
        next(error);
    }
}

export const getAllMessages = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const {from, to} = req.params;
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: parseInt(from),
                        receiverId: parseInt(to)
                    },
                    {
                        senderId: parseInt(to),
                        receiverId: parseInt(from)
                    }
                ]
            },
            orderBy: {
                id: "asc"
            },
        });

        const unReadMessages = [];
        messages.forEach((message, index) => {
            if (message.messageStatus !== "read" && message.senderId === parseInt(to)) {
                messages[index].messageStatus = "read";
                unReadMessages.push(message.id);
            }
        });

        await prisma.message.updateMany({
            where: {
                id: {
                    in: unReadMessages
                }
            },
            data: {
                messageStatus: "read"
            }
        });

        return res.status(200).json({messages, success: true});
    } catch (error) {
        next(error);
    }

}

export const addImageMessage = async (req, res, next) => {
    try {
        if(req.file){
            const date = Date.now();
            let fileName = "public/images/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance();
            const {from, to} = req.query;

            if(from && to){
                const message = await prisma.message.create({
                    data: {
                        message: fileName,
                        type: "image",
                        sender: {connect: {id: parseInt(from)}},
                        receiver: {connect: {id: parseInt(to)}},
                        // messageStatus: "sent"
                    }
                });
                return res.status(201).json({message, success: true});
            }
            return res.status(400).json({message: "All fields are required", success: false});
        }
        return res.status(400).json({message: "Image is required", success: false});
    } catch (error) {
        next(error);
    }
}

export const addAudioMessage = async (req, res, next) => {
    try {
        if(req.file){
            const date = Date.now();
            let fileName = "public/recordings/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance();
            const {from, to} = req.query;

            if(from && to){
                const message = await prisma.message.create({
                    data: {
                        message: fileName,
                        type: "audio",
                        sender: {connect: {id: parseInt(from)}},
                        receiver: {connect: {id: parseInt(to)}},
                        // messageStatus: "sent"
                    }
                });
                return res.status(201).json({message, success: true});
            }
            return res.status(400).json({message: "All fields are required", success: false});
        }
        return res.status(400).json({message: "Audio is required", success: false});
    } catch (error) {
        next(error);
    }
}