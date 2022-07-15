import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { v4 as uuid } from 'uuid'

export default class ResetsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['email'])
      if (data.email === '' && !data.email.includes('@')) {
        return response.json({ error: 'Please enter a valid email' })
      }
      const user = await User.findByOrFail('email', data.email)

      const userToken = uuid().toString()
      const dateNow = new Date()

      user.token = userToken
      user.tokenCreatedAt = dateNow
      await user.save()
      const { email, token, tokenCreatedAt } = user
      return {
        user: { email, token, tokenCreatedAt },
        message: 'Reset password link has been sent to your email',
      }
    } catch (error) {
      return response.json({ error: error.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('token', params.token)
      const data = request.only(['password'])
      if (data.password === '') {
        return response.json({ error: 'Please enter a valid password' })
      }
      user.password = data.password
      user.token = null
      user.tokenCreatedAt = null
      await user.save()
      return { message: 'Password has been reset successfully' }
    } catch (error) {
      return response.json({ error: error.message })
    }
  }
}
