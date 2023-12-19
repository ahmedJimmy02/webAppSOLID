import bcrypt from 'bcrypt'

function hashedPasswordMethod(password){
    const passwordHash = bcrypt.hashSync(password , +process.env.SAULT_ROUNDS)
    return passwordHash
}
export default hashedPasswordMethod