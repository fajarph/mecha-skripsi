import { DateTime } from 'luxon'
import { HasMany, hasMany, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'

export default class Price extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public harga: string

  @hasMany(() => Order, {
    foreignKey: 'price_id', // defaults to userId
  })
  public orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
