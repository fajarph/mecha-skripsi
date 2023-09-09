import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Order from "App/Models/Order";

const generateRandomValue = () => {
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomNumbers = '0123456789';
    let result = '';

    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * randomLetters.length);
        result += randomLetters.charAt(randomIndex);
    }

    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * randomNumbers.length);
        result += randomNumbers.charAt(randomIndex);
    }

    return result;
}

export default class OrdersController {

    public async getOrder({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await Order.query()
                .preload("prices", (query) => {
                    query.select("id", "price", "description_service")
                })
                .select("id", "name", "id_service", "name_service", "status", "address", "map_url", "created_at", "sum", "img_url")

            response.status(200).json({
                status: 200,
                msg: "Order hit successfully",
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
            const { name_service, status, address, map_url, sum } = request.all()

            const newOrder = new Order()
            newOrder.fill({
                name: user?.name,
                id_service: generateRandomValue(),
                name_service,
                status,
                address,
                img_url: user?.img_url,
                map_url,
                sum,
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
