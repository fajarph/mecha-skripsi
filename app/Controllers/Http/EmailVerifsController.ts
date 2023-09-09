import User from "App/Models/User"
const { sendOTP, verifyOTP, deleteOTP} = require("../Http/OtpsController")

const verifyUserEmail = async ({email, otp}) => {
    try {
        const validOTP = await verifyOTP({ email, otp})
        
        if (!validOTP) {
            throw Error("Invalid code passed. Check your inbox.")
        }

        const user = await User.findBy("email", email)
        if (!user) {
            throw new Error("User not found.")
        }
        
        user.verified = true
        await user.save()

        await deleteOTP(email)
        return
    } catch (error) {
        throw error
    }
}

const sendVerificationOTPEmail = async (email) => {
    try {
        const existingUser = await User.findBy("email", email)

        if (!existingUser) {
            throw Error("There's no account for the provided email.")
        }

        const otpDetails = {
            email,
            subject: "Email Verification",
            message: "Verify your email with the code below.",
            duration: 1,
        }

        const createdOTP = await sendOTP(otpDetails)
        return createdOTP
    } catch (error) {
        throw error
    }
}

module.exports = { sendVerificationOTPEmail, verifyUserEmail } 
