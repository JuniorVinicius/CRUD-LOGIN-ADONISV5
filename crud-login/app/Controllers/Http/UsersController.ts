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
    try {
      const users = await User.all()
      const usersJson: UserData[] = []

      for (let i = 0; i < users.length; i++) {
        const { id, email, name, age } = users[i]
        usersJson.push({ id, email, name, age })
      }
      return response.json({ users: usersJson })
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['email', 'password', 'name', 'age'])
      const hasEmail = await User.findBy('email', data.email)

      if (data.email === '' || data.password === '' || data.name === '' || data.age === '') {
        return response.json({ error: 'Please fill all fields' })
      }

      if (!data.email.includes('@')) {
        return response.json({ error: 'Please enter a valid email' })
      }

      if (hasEmail) {
        return response.status(400).json({ error: 'Email already exists' })
      }

      const user = await User.create(data)
      const { id, email, name, age } = user
      return { user: { id, name, email, age }, message: 'User created successfully' }
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      const data = request.only(['email', 'password', 'name', 'age'])
      if (data.email && !data.email.includes('@')) {
        return response.json({ error: 'Please enter a valid email' })
      }
      user.merge(data)
      await user.save()
      const { id, email, name, age } = user
      return { user: { id, name, email, age }, message: 'User updated successfully' }
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return { message: 'User deleted successfully' }
    } catch (error) {
      return response.json({ error: error.message })
    }
  }
}
