import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { 
  column, 
  beforeSave, 
  BaseModel,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'
import Chat from './Chat'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public no_telp: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public role: number

  @column()
  public img_url: string

  @column()
  public no_rek: string

  @column()
  public verified: boolean = false

  @hasMany(() => Order, {
    foreignKey: 'user_id',
  })
  public orders: HasMany<typeof Order>

  @hasMany(() => Chat, {
    foreignKey: 'user_id',
  })
  public chats: HasMany<typeof Chat>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
