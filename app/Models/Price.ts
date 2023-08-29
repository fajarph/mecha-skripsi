import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Price extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public price: string

  @column()
  public description_service: string

  @column({ serializeAs: null })
  public order_id: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
