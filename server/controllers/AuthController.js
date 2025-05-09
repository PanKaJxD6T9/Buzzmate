import getPrismaInstance from "../utils/PrismaClient.js";
import {generateToken04} from "../utils/TokenGenerator.js";

export const checkUser = async(req, res, next) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.json({message: "Email is required", success: false});
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if(!user){
            return res.json({message: "User not found", success: false});
        } else {
            return res.json({message: "User found", success: true, data: user});
        }
    } catch(err){
        next(err);
    }
}

export const onBoarding = async(req, res, next) => {
    try {
        const {email, name, image: profileImage, about} = req.body;
        if(!email || !name || !profileImage){
            return res.json({message: "Email, Name and Profile Image are required", success: false});
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.create({
            data: {
                email,
                name,
                profileImage,
                about
            }
        });
        return res.json({message: "User created", success: true, user});
    } catch (error) {
        next(error);
    }
}

export const getAllUsers = async(req, res, next) => {
    try{
        const prisma = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy: {
                name: "asc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                about: true
            }
        });

        const usersGroupedByInitial = {};

        users.forEach((user)=>{
            const initial = user.name.charAt(0).toUpperCase();
            if(!usersGroupedByInitial[initial]){
                usersGroupedByInitial[initial] = [];
            }
            usersGroupedByInitial[initial].push(user);
        })
        return res.status(200).json({message: "Users found", success: true, users: usersGroupedByInitial});
    } catch(err){
        next(err);
    }
}

export const generateToken = (req, res, next) => {
    try{
        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_SECRET;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = "";

        if(appId && serverSecret && userId){
            const token = generateToken04(appId, userId, serverSecret, effectiveTime, payload);
            return res.status(200).json({token});
        }
        return res.status(400).send("Invalid appID or serverSecret");
    } catch(err){
        next(err);
    }
}
