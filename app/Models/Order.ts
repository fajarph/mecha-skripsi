import { DateTime } from 'luxon'
import { hasMany, HasMany, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Price from './Price'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name_service: string

  @column()
  public status: string

  @column()
  public address: string

  @column()
  public map_url: string

  @column()
  public sum: string

  @column()
  public id_service: string

  @column({ serializeAs: null })
  public user_id: number | null

  @hasMany(() => Price, {
    foreignKey: 'order_id', // defaults to userId
  })
  public prices: HasMany<typeof Price>

  @column.dateTime({ 
    autoCreate: true,
    serialize: (value: DateTime) => value.toFormat('yyyy-MM-dd HH:mm'),
  })
  public createdAt: DateTime

  @column.dateTime({ 
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime) => value.toFormat('yyyy-MM-dd HH:mm'),
  })
  public updatedAt: DateTime
}
