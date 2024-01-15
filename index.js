import express from 'express'
import dotenv from 'dotenv'
import db_connection from './db/db_connection.js'
import errorHandler from './src/middlewares/errorHandler.js'
import userRouter from './src/modules/user/user.router.js'
import productRouter from './src/modules/product/product.router.js'
import commentRouter from './src/modules/comment/comment.router.js'
import likeRouter from './src/modules/likes/like.router.js'
import replyRouter from './src/modules/reply/reply.router.js'

const app = express()

dotenv.config()
db_connection()

app.use(express.json())
app.use('/uploads' , express.static('src/uploads'))
app.use('/user',userRouter)
app.use('/product',productRouter)
app.use('/comment',commentRouter)
app.use('/like',likeRouter)
app.use('/reply',replyRouter)

app.use(errorHandler)

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})