import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Price from "App/Models/Price";

export default class PricesController {
    public async createPrice({ request, response, auth} : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { price, description_service } = request.all()

            const newPrice = new Price()
            newPrice.fill({
                price,
                description_service,
                order_id: user?.id
            })

            await newPrice.save()

            response.status(200).json({
                status: 200,
                msg: "Order created successfully",
                order: newPrice
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }
}
