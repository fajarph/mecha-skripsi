/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
const { sendOTP, verifyOTP } = require("../app/Controllers/Http/OtpsController")
const { sendVerificationOTPEmail, verifyUserEmail } = require("../app/Controllers/Http/EmailVerifsController")
const { sendPasswordResetOTPEmail, resetUserPassword } = require("../app/Controllers/Http/PasswordOtpsController")

Route.get('/', async () => {
  return { msg: 'API Hit Succes' }
})

Route.group(() => {
  Route.post("register", "AuthController.register");
  Route.post("login", "AuthController.login");
  Route.get("users", "UsersController.getUser")
  Route.get("users/token", "UsersController.getUserByToken")
  Route.get("orders", "OrdersController.getOrder")
  Route.post("orders", "OrdersController.createOrder");
  Route.post("prices", "PricesController.createPrice")
}).prefix("api");

Route.group(() => {
  Route.post('/', async ({ request, response }) => {
    try {
      const {name, no_telp, email, password, subject, message, duration } = request.all()

      const createdOTP = await sendOTP({
        name,
        no_telp,
        email,
        password,
        subject,
        message,
        duration
      })

      response.status(200).json(createdOTP)
    } catch (error) {
      response.status(400).json(error.message)
    }
  })
  
  Route.post('verify', async ({ request, response }) => {
    try {
      let { email, otp } = request.body()
  
      const validOTP = await verifyOTP({ email, otp })
      response.status(200).json({ valid: validOTP})
    } catch (error) {
      response.status(400).json(error.message)
    }
  })
}).prefix("api/otp")

Route.group(() => {
  Route.post('/', async ({ request, response }) => {
    try {
      const { email } = request.body()
      
      if (!email) throw Error("An email is required!")
  
      const createdEmailVerificationOTP = await sendVerificationOTPEmail(email)
      response.status(200).json(createdEmailVerificationOTP)
      
    } catch (error) {
      response.status(400).json(error.message)
    }
  })

  Route.post('verify', async ({ request, response }) => {
    try {
      let { email, otp } = request.body()

      if (!(email && otp )) throw Error("Empty otp details are not allowed")
         
      await verifyUserEmail({email, otp})
      response.status(200).json({email, verified: true})
    } catch (error) {
      response.status(400).json(error.message)
    }
  })
}).prefix("api/email_verification")

Route.group(() => {
  Route.post('/', async ({ request, response }) => {
    try {
      const { email } = request.body()

      if (!email ) throw Error("An email is required.")

      const createPasswordResetOTPEmail = await sendPasswordResetOTPEmail(email)

      response.status(200).json(createPasswordResetOTPEmail)
    } catch (error) {
      response.status(400).json(error.message)
    }
  })

  Route.post('reset', async ({ request, response }) => {
    try {
      const { email, otp, password } = request.body()

      if (!(email && otp && password) ) throw Error("Empty credentials are not allowed.")

      await resetUserPassword({ email, otp, password })
      response.status(200).json({ email, passwordreset: true})
    } catch (error) {
      response.status(400).json(error.message)
    }
  })
}).prefix("v1/api/forget_password")
