import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Price from "App/Models/Price"
import Order from "App/Models/Order"

export default class PricesController {

    public async createPrice({ request, response, auth, params } : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { price, description_service } = request.all()
            const { id_service } = params

            if (!user || !user.id) {
                return response.status(401).json({ msg: 'User not authenticated' })
            }

            const order = await Order.query()
                .where('id_service', id_service)
                .where('user_id', user.id)
                .first()

            if (!order) {
                return response.status(404).json({ msg: 'Order not found' })
            }

            const newPrice = new Price()
            newPrice.fill({
                price,
                description_service,
            })

            await order.related('prices').save(newPrice)

            return response.status(200).json({
                status: 200,
                msg: "Price created successfully",
                price: newPrice,
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }
}
