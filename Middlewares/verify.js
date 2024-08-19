
const jwt=require("jsonwebtoken")


// create middleware func to verify token
const verifyToken=(request,response,next)=>{
    // get bearer token from request.headers

    const bearerToken=request.headers.authorization;

    // if bearer token not found
    if(bearerToken===undefined){
        response.status(200).send({messege:"unauthorized access plz login first"})
    }
    // if bearer token is existed

    else{
        // get token form bearer token
        const token=bearerToken.split(" ")[1] //["bearer",Token]

        // verify token
        try{
            jwt.verify(token,"absdcdh")
            // calling next modlleware
            next()
        }
        catch(err){
                // forward err to err handling middleare
                // next(new Error("Session expired plz login to continue"))
                console.log(err)
                response.status(401).send({messege:"Session expired plz login again"})
                // next(console.log(err))
                // console.log("Error is ",err)
            }
        

    }


}



module.exports=verifyToken