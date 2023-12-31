import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import HistoryOrder from "App/Models/HistoryOrder"


export default class HistoryOrdersController {

    public async getHistoryOrder({ response, auth }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const output = await HistoryOrder.query()
                .preload("prices", (query) => {
                    query.select("id", "price", "description_service")
                })
                .select("id", "name", "id_service", "user_id", "name_service", "status", "address", "map_url", "created_at", "sum", "img_url")

            const historiesWithUserId = output.map((history) => {
                return {
                    ...history.toJSON(),
                    user_id: history.user_id,
                };
            });

            response.status(200).json({
                status: 200,
                msg: "History hit successfully",
                order: historiesWithUserId
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async getHistoryId({ response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const userId = params.user_id

            const output = await HistoryOrder.query()
                .where('user_id', userId)
                .preload("prices", (query) => {
                    query.select("id", "price", "description_service")
                })
                .select("id", "name", "id_service", "user_id", "name_service", "status", "address", "map_url", "created_at", "sum", "img_url")
            
            const historiesWithUserId = output.map((history) => {
                return {
                    ...history.toJSON(),
                    user_id: history.user_id,
                };
            });

            response.status(200).json({
                status: 200,
                history: historiesWithUserId
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async createHistoryOrder({ request, response, auth} : HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const {name, name_service, status, address, map_url, sum, id_service } = request.all()

            const newHistory = new HistoryOrder()
            newHistory.fill({
                name,
                id_service,
                name_service,
                status,
                address,
                img_url: user?.img_url,
                map_url,
                sum,
                user_id: user?.id
            })

            await newHistory.save()

            response.status(200).json({
                status: 200,
                msg: "History created successfully",
                order: newHistory
            })
        } catch (error) {
            response.status(404).json({
                status: 404,
                msg: error.message
            })
        }
    }

    public async updateNameHistory({ request, response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const userId = params.user_id
            const historyId = params.id_service
        
            const { name } = request.only(["name"])

            const historyEntries = await HistoryOrder.query()
                .where('user_id', userId)
                .where('id_service', historyId)
                .exec();

            if (!historyEntries || historyEntries.length === 0) {
                return response.status(404).json({ msg: 'History not found' })
            }

            for (const history of historyEntries) {
                history.name = name;
                await history.save();
            }

            return response.json({
                status: 200,
                msg: 'Name history successfully updated',
                updatedName: name
            });
        } catch (error) {
            return response.status(401).json({msg: 'An error occurred while updating'})
        }
    }

    public async updateStatusHistory({ request, response, auth, params }: HttpContextContract) {
        try {
            await auth.use("api").authenticate()

            const { id_service } = params;
            const { status } = request.only(["status"])

            const historyEntries = await HistoryOrder.query()
                .where('id_service', id_service)
                .exec();

            if (!historyEntries || historyEntries.length === 0) {
                return response.status(404).json({ msg: 'History not found' })
            }

            for (const history of historyEntries) {
                history.status = status;
                await history.save();
            }

            return response.json({
                status: 200,
                msg: 'History status successfully updated',
                updatedStatus: status
            });
        } catch (error) {
            return response.status(401).json({msg: 'An error occurred while updating'})
        }
    }
}
