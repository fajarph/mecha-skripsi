import Otp from "App/Models/Otp"
const generateOTP = require("../../Utils/generateOtp")
const sendEmail = require("../../Utils/sendEmail")
const { hashData, verifyHashedData } = require("../../Utils/hashData")
const { SMTP_EMAIL } = process.env

const verifyOTP = async ({email, otp}) => {
    try {
        if (!(email && otp)) {
            throw Error("Provide values for email, otp")
        }

        const matchedOTPRecord = await Otp.findBy("email", email)

        if (!matchedOTPRecord) {
            throw Error("No otp record found.")
        }

        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP);
        return validOTP;
    } catch (error) {
        throw error
    }
}

const sendOTP = async ({email, subject, message, duration = 1 }) => {
    try {
        if (!( email && subject && message )) {
            throw Error("Provide values for email, subject, message")
        }

        await Otp.query().where('email', email).delete()

        const generatedOTP = await generateOTP()

        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject,
            html: `<p>${message}</p><p style="color:tomato;
            font-size:25px;letter-spacing:2px;"><b>
            ${generatedOTP}</b></p><p>This Code <b>expires in ${duration} hour(s)</b>.</p>`
        }
        await sendEmail(mailOptions)

        const hashedOTP = await hashData(generatedOTP)
        const newOTP = new Otp()
        newOTP.email = email
        newOTP.otp = hashedOTP
        newOTP.created = new Date()
        newOTP.expires = new Date(Date.now() + 3600 * +duration)

        const createdOTPRecord = await newOTP.save()
        return createdOTPRecord
    } catch (error) {
        throw error
    }
}

const deleteOTP = async (email) => {
    try {
        const user = await Otp.findByOrFail("email", email);
        await user.delete()
    } catch (error) {
        throw error
    }
}

module.exports = { sendOTP, verifyOTP, deleteOTP } 
