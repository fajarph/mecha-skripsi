import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Price from "App/Models/Price"
import Order from "App/Models/Order"
import HistoryOrder from "App/Models/HistoryOrder"

export default class PricesController {

    public async getPriceById({ response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const id_service = params.id_service

            const price = await Price.query()
                .where('id_service', id_service)
                .select("id", "price", "description_service")
            
            response.status(200).json({
                status: 200,
                msg: "Price get successfully",
                price: price
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async getPriceByIdService({ response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const historyId = params.history_id
            const serviceId = params.id_service

            const price = await Price.query()
                .where('history_id', historyId)
                .where('id_service', serviceId)
                .select("id", "price", "description_service")
            
            response.status(200).json({
                status: 200,
                msg: "Price get successfully",
                price: price
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async createPriceInOrders({ request, response, auth, params } : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const { price, description_service } = request.all()
            const id_service = params.id_service

            const order = await Order.query()
                .where('id_service', id_service)
                .first()

            if (!order) {
                return response.status(404).json({ msg: 'Order not found' })
            }

            const newPrice = new Price()
            newPrice.fill({
                price,
                description_service,
                id_service: order.id_service
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

    public async createPriceInHistories({ request, response, auth, params } : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const { price, description_service } = request.all()
            const id_service = params.id_service

            const history = await HistoryOrder.query()
                .where('id_service', id_service)
                .first()

            if (!history) {
                return response.status(404).json({ msg: 'History not found' })
            }

            const newPrice = new Price()
            newPrice.fill({
                price,
                description_service,
                id_service: history.id_service
            })

            await history.related('prices').save(newPrice)

            return response.status(200).json({
                status: 200,
                msg: "Price created successfully",
                price: newPrice
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async createPriceInHistoriesUser({ request, response, auth, params } : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const { price, description_service } = request.all()
            const user_id = params.user_id
            const id_service = params.id_service

            const history = await HistoryOrder.query()
                .where('user_id', user_id)
                .where('id_service', id_service)
                .first()

            if (!history) {
                return response.status(404).json({ msg: 'History not found' })
            }

            const newPrice = new Price()
            newPrice.fill({
                price,
                description_service,
                id_service: history.id_service
            })

            await history.related('prices').save(newPrice)

            return response.status(200).json({
                status: 200,
                msg: "Price created successfully",
                price: newPrice
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async createPriceInHistoriesById({ request, response, auth, params } : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const { price, description_service } = request.all()
            const historyId = params.id

            const history = await HistoryOrder.find(historyId);

            if (!history) {
                return response.status(404).json({ msg: 'History not found' })
            }

            const newPrice = new Price()
            newPrice.fill({
                price,
                description_service,
                id_service: history.id_service
            })

            await history.related('prices').save(newPrice)

            return response.status(200).json({
                status: 200,
                msg: "Price created successfully",
                price: newPrice,
                id: newPrice.id
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }
}
