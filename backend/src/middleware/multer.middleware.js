import multer from "multer";

//Here we validate file type and allow access to valid type
const typeValidation = (req, file, cd) => {
    const allowedTypes = ["image/jpeg", "image/png"]
    if(!allowedTypes.includes(file.mimeType)) return cd(new Error("Invalide file type!!"), false)
    return cd(null, true)   
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/Public/temp')
    },
    filename: function (req, file, cb) {
      console.log(req.file)
      cb(null, `${ Date.now()}-${file.originalname}` )
    }
  })

 export const upload = multer({storage, fileFilter : typeValidation}) 