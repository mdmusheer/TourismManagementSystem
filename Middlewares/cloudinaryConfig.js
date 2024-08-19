const cloudinary=require("cloudinary").v2;
const multer=require("multer")
const {CloudinaryStorage}=require("multer-storage-cloudinary")


// configure cloudinary

cloudinary.config({
    cloud_name:"drnmjto0x",
    api_key:"344825136526943",
    api_secret:"Ft5cJlxY0aEtmx_jidb0r99Etf4"
})

// configure cloudinary storage

let clStorage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"usersapp",
        public_id:(request,file)=>file.fieldname+"-"+Date.now()
    }
})


// configure multer

let multerObject=multer({
    storage:clStorage
})

// export multer object
module.exports=multerObject