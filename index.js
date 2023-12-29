import express from 'express'
import dotenv from 'dotenv'
import db_connection from './db/db_connection.js'
import errorHandler from './src/middlewares/errorHandler.js'
import userRouter from './src/modules/user/user.router.js'
import productRouter from './src/modules/product/product.router.js'

const app = express()

dotenv.config()
db_connection()

app.use(express.json())
app.use('/uploads' , express.static('src/uploads'))
app.use(userRouter)
app.use(productRouter)

app.use(errorHandler)

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})