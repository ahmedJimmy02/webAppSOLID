import multer from 'multer'
import generateUniqueString from '../../utils/generateUniqueString.js'
import allowedExtensions from '../../utils/allowedExtensions.js'
import fs from 'fs'
import path from 'path'
// middleware

export const multerMiddleware = ({extension = allowedExtensions.image , filePath = 'general'})=>{
    // path check
    const destinationPath = path.resolve(`src/uploads/${filePath}`)
    if(!fs.existsSync(destinationPath)){
        fs.mkdirSync(destinationPath, {recursive: true})
    }
    // diskStorage
    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null , destinationPath)
        },
        filename: function(req,file,cb){
            const uniqueFileName = generateUniqueString(5) + '-' + file.originalname
            cb(null , uniqueFileName)
        }
    })
    // file filter
    const fileFilter = (req,file,cb)=>{
        if(extension.includes(file.mimetype.split('/')[1])){
            return cb(null , true)
        }
        return cb(new Error('Image format is not allowed') , false)
    }

    const file = multer({fileFilter , storage})
    return file
}
// application/octet-stream => default when no extension