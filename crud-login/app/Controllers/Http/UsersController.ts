import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

interface UserData {
  id: number
  email: string
  name: string
  age: number
}

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    const usersJson: UserData[] = []

    for (let i = 0; i < users.length; i++) {
      const { id, email, name, age } = users[i]
      usersJson.push({ id, email, name, age })
    }
    return response.json(usersJson)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['email', 'password', 'name', 'age'])
    const user = await User.create(data)
    return response.json(user)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['email', 'password', 'name', 'age'])
    user.merge(data)
    await user.save()
    return response.json(user)
  }

  public async delete({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.json({ success: true })
  }
}
