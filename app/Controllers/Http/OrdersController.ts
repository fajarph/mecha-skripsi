import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Order from "App/Models/Order"

const generateRandomValue = () => {
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomNumbers = '0123456789'
    let result = ''

    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * randomLetters.length)
        result += randomLetters.charAt(randomIndex)
    }

    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * randomNumbers.length)
        result += randomNumbers.charAt(randomIndex)
    }

    return result
}

export default class OrdersController {

    public async getOrder({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await Order.query()
                .preload("prices", (query) => {
                    query.select("id", "price", "description_service", "id_service")
                })
                .select("id", "name", "id_service", "user_id", "name_service", "status", "address", "map_url", "created_at", "sum", "img_url")
                
                const ordersWithUserId = output.map((order) => {
                    return {
                        ...order.toJSON(),
                        user_id: order.user_id,
                    };
                });

            response.status(200).json({
                status: 200,
                msg: "Order hit successfully",
                order: ordersWithUserId
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async getOrderId({ response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const userId = params.user_id

            const order = await Order.query()
                .where('user_id', userId)
                .preload("prices", (query) => {
                    query.select("id", "price", "description_service", "id_service")
                    })
                .select("id", "name", "id_service", "name_service", "status", "address", "map_url", "created_at", "sum", "img_url")

            response.status(200).json({
                id: userId,
                status: 200,
                msg: "Order hit successfully",
                order: order
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
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
                id_service: newOrder.id_service,
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

    public async updateSumOrders({ request, response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user_id  = params.user_id

            const { sum } = request.only(["sum"])

            const sumOrders = await Order.query()
                .where('user_id', user_id)
                .exec();

            if (!sumOrders || sumOrders.length === 0) {
                return response.status(404).json({ msg: 'Orders not found' })
            }

            for (const order of sumOrders) {
                order.sum = sum;
                await order.save();
            }

            return response.json({
                status: 200,
                msg: 'Sum status successfully updated',
                updatedSum: sum
            });
        } catch (error) {
            return response.status(401).json({msg: 'An error occurred while updating'})
        }
    }

    public async deleteOrder({ params, response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()
            
            const order = await Order.findByOrFail('id', params.id)
            await order.delete();
        
            return response.status(200).json({
                status: 200,
                msg: "Order deleted successfully"
            })
        }catch (error) {
            return response.status(500).json({
                status: 500,
                msg: "Order not found or unauthorized"
            })
        }
    }
}
