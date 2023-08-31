import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'

export default class ChatsController {
    public async index({ response, auth }: HttpContextContract) {
        await auth.use("api").authenticate()

        const chats = await Chat.all()
        return response.ok(chats)
    }
    
    public async store({ request, response, auth }: HttpContextContract) {
        await auth.use("api").authenticate()

        const data = request.only(['user_id', 'message'])
        const chat = await Chat.create(data)
        return response.created(chat)
    }
}
