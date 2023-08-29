import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Order from "App/Models/Order";

export default class OrdersController {

    public async getOrder({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await Order.query()
                .preload("prices", (query) => {
                    query.select("id", "price", "description_service")
                })
                .select("id", "name_service", "status", "address", "map_url", "created_at", "sum")

            response.status(200).json({
                status: 200,
                order: output
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async createOrder({ request, response, auth} : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { name_service, status, address, map_url } = request.all()

            const newOrder = new Order()
            newOrder.fill({
                name_service,
                status,
                address,
                map_url,
                user_id: user?.id
            })

            await newOrder.save()

            response.status(200).json({
                status: 200,
                msg: "Order created successfully",
                order: newOrder
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }
}
