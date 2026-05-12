import User from '#models/user'

export default class AuthService {
  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], { expiresIn: '7 days' })
    return { user, token }
  }

  async logout(user: User) {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
  }
}
