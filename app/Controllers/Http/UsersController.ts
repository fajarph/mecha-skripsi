import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import User from "App/Models/User"

export default class UsersController {

    public async getUser({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await User.query()
                .preload("orders", (orderQuery) => {
                    orderQuery.select("id", "id_service", "name_service", "status", "address", "map_url", "created_at")
                    .preload("prices", (priceQuery) => {
                        priceQuery.select("id", "price", "description_service")
                    })
                })
                .preload("history_orders", (historyQuery) => {
                    historyQuery.select("id", "id_service", "name_service", "status", "address", "map_url", "created_at")
                    .preload("prices", (priceQuery) => {
                        priceQuery.select("id", "price", "description_service")
                    })
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

    public async updateProfileUser({ request, response, params, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = await User.find(params.id)

            if (!user) {
                return response.status(401).json({msg: 'User not found' })
            }

            const data = request.only(['email', 'name', 'no_telp'])

            user.merge(data)

            await user.save()
            
            return response.json({
                status: 200,
                msg: 'User successfully updated',
                name: user.name,
                email: user.email,
                no_telp: user.no_telp 
            })
        } catch (error) {
            return response.status(401).json({msg: 'An error occurred while updating'})
        }
    }
}
