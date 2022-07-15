import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      const { email, password } = request.all()
      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(400).json({ error: 'Email not found' })
      }
      const token = await auth.use('api').attempt(email, password)
      const { id, name, age } = user
      return { user: { id, name, email: user.email, age }, token, message: 'Login successful' }
    } catch (error) {
      return response.json({ error: error.message })
    }
  }
}
