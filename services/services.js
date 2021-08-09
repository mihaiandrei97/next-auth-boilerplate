import Client from './client'
class ServicesClass {
  constructor() {
    this.client = Client
  }

  getRawData(reportId) {
    return this.client.get(`/reports/rawData?reportId=${reportId}`)
  }

  async login({ email, password }) {
    const tokenResp = await this.client.post(
      '/auth/login',
      {
        email: email,
        password: password
      },
      {
        authorization: false
      }
    )
    
    return tokenResp
  }

  async getHello() {
    const result = await this.client.get('/')
    return result
  }

  async getUser() {
    const result = await this.client.get('/auth/user')
    return result
  }
}

export const Services = new ServicesClass()
