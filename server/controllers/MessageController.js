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

export const getInitialContacts = async(req, res, next) => {
    try {
        const userId = parseInt(req.params.from);
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({
            where : {
                id: userId
            },
            include: {
                sentMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                },
                receivedMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                }
            }
        });
        const messages = [...user.sentMessages, ...user.receivedMessages];
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        const users = new Map();
        const messageStatusChange = [];

        messages.forEach((msg)=>{
            const isSender = msg.senderId === userId;
            const calculatedId = isSender ? msg.receiverId : msg.senderId;
            if(msg.messageStatus === "sent"){
                messageStatusChange.push(msg.id);
            }

            
            if(!users.get(calculatedId)){
                const {
                    id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId
                } = msg;
                
                let user = {
                    messageId: id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId,
                    // totalUnreadMessages: 0
                }

                if(isSender){
                    user = {
                        ...user,
                        ...msg.receiver,
                        totalUnreadMessages: 0
                    }
                } else {
                    user = {
                        ...user,
                        ...msg.sender,
                        totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
                    }
                }

                users.set(calculatedId, { ...user });

            } else if(messageStatusChange !== "read" && !isSender){
                const user = users.get(calculatedId);
                users.set(calculatedId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1,
                });

            }
        });

        if(messageStatusChange.length > 0){
            await prisma.message.updateMany({
                where: {
                    id: {
                        in: messageStatusChange
                    }
                },
                data: {
                    messageStatus: "delivered"
                }
            }); 
        }

        return res.status(200).json({
            users: Array.from(users.values()),
            onlineUsers: Array.from(onlineUsers.keys()),
            success: true
        });

    } catch (error) {
        next(error);
    }
}