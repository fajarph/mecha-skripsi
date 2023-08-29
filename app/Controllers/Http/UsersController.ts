import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UsersController {

    public async getUser({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await User.query()
                .preload("orders", (query) => {
                    query.select("id", "name_service", "status", "address", "map_url", "created_at")
                })
                .select("id", "name", "no_telp", "email", "role", "no_rek")

            response.status(200).json({
                status: 200,
                user: output
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async getUserByToken({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()
          
            const user = auth.use("api").user
            const output = await User.query()
                .where("id", user!.id)
                .preload("orders", (query) => {
                    query.select("id", "name_service", "status", "address", "createdAt")
                })
                .select("id", "name", "no_telp", "email", "role", "no_rek")

            response.status(200).json({
                status: 200,
                user: output
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }
}
