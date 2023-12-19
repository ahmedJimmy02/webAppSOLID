import bcrypt from 'bcrypt'

function comparePassword(password , comparePassword){
    const check = bcrypt.compareSync(password, comparePassword)
    return check
}
export default comparePassword