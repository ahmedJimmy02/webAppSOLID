import { customAlphabet } from "nanoid";

const generateUniqueString = (length)=>{
    const nanoid = customAlphabet('12345abcdef' , length || 6 )
    return nanoid()
}

export default generateUniqueString