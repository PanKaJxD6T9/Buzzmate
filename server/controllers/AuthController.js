import getPrismaInstance from "../utils/PrismaClient.js";

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