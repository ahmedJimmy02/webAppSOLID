import jwt from 'jsonwebtoken'

function verifyToken(token){
    const payload = jwt.verify(token,  process.env.SECRET_KEY)
    return payload
}
export default verifyToken