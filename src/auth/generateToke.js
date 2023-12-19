import jwt from 'jsonwebtoken'

function generateToken(data){
    const token = jwt.sign(data , process.env.SECRET_KEY , {expiresIn:'2d'})
    return token
}

export default generateToken