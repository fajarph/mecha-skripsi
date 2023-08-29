import User from "App/Models/User"
const { sendOTP, verifyOTP, deleteOTP } = require("../Http/OtpsController")

const resetUserPassword = async ({ email, otp, password }) => {
    try {
        const validOTP = await verifyOTP({ email, otp });

        if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.");
        }

        const hashedNewPassword = await (password);
        const user = await User.findBy('email', email);

        if (!user) {
            throw new Error("User not found.");
        }

        user.password = hashedNewPassword;
        await user.save();
        
        await deleteOTP(email);

        return;
    } catch (error) {
        throw error;
    }
}

const sendPasswordResetOTPEmail = async (email) => {
    try {
        const existingUser = await User.findBy("email", email)

        if (!existingUser) {
            throw Error("There's no account for the provided email")
        }

        if (!existingUser.verified) {
            throw Error("Email hasn't been verified yet. Check your inbox")
        }

        const otpDetails = {
            email,
            subject: "Password Reset",
            message: "Enter the code below to reset your password.",
            duration: 1,
        }
        const createOTP = await sendOTP(otpDetails)
        return createOTP
    } catch (error) {
        throw error
    }
}

module.exports = { sendPasswordResetOTPEmail, resetUserPassword }