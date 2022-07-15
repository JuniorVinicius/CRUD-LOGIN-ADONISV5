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

Route.get('/', async () => {
  return { message: 'Hello World!' }
})

Route.post('/login', 'AuthController.login')
Route.post('/reset', 'ResetsController.store')
Route.post('/reset/:token', 'ResetsController.update')

Route.group(() => {
  Route.post('/create', 'UsersController.store')
  Route.group(() => {
    Route.get('/list-all', 'UsersController.index')
    Route.put('/update/:id', 'UsersController.update')
    Route.delete('/delete/:id', 'UsersController.delete')
  }).middleware('auth')
})
