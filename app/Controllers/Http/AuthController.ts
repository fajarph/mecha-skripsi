import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"

export default class AuthController {

    public async login({ request, auth }: HttpContextContract) {
        try {
            const email = request.input("email")
            const password = request.input("password")

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "1 days",
            })
    
            const user = await User.findBy("email", email)

            if (!user) {
                throw Error("Invalid email entered!")
            }

            return {
                status: 200,
                token: token.token,
                role: user.role,
                msg: "Login successful"
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

            const newUser = new User()

            newUser.name = name
            newUser.no_telp = no_telp
            newUser.email = email
            newUser.password = password
            newUser.role = role

            await newUser.save()

            const token = await auth.use("api").login(newUser, {
                expiresIn: "1 days",
            })

            return {
                status: 200,
                token: token.token,
                message: "Registration is successful"
            }
        } catch (error) {
            throw error
        }
    }
}
