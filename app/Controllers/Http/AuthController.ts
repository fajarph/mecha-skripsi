import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"
const { sendVerificationOTPEmail } = require("../Http/EmailVerifsController")

export default class AuthController {

    public async login({ request, auth, response }: HttpContextContract) {
        try {
            const email = request.input("email")
            const password = request.input("password")

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "1 days",
            })
    
            const fetchedUser = await User.findBy("email", email)

            if (!fetchedUser) {
                throw Error("Invalid email entered!")
            }

            if (!fetchedUser.verified) {
                return response.status(400).json({
                    message: "Email hasn't been verified yet. Check your inbox",
                    status: 400,
                });
            }

            return {
                status: 200,
                token: token.token,
                nama: fetchedUser.name,
                email: fetchedUser.email,
                role: fetchedUser.role,
                verified: fetchedUser.verified
            }
        } catch (error) {
            throw error
        }
    }

    public async register({ request, auth }: HttpContextContract) {
        try {
            const name = request.input("name")
            const no_telp = request.input("no_telp")
            const email = request.input("email")
            const password = request.input("password")
            const role = request.input("role")
            const no_rek = request.input("no_rek")

            const newUser = new User()

            newUser.name = name
            newUser.no_telp = no_telp
            newUser.email = email
            newUser.password = password
            newUser.role = role
            newUser.no_rek = no_rek

            await newUser.save()

            const token = await auth.use("api").login(newUser, {
                expiresIn: "1 days",
            })

            await sendVerificationOTPEmail(email)

            return {
                status: 200,
                token: token.token,
                message: "Registration is successful",
                verified: newUser.verified
            }
        } catch (error) {
            throw error
        }
    }
}
