// import path
const path=require("path")

// importing bcryptjs
const bcryptjs=require("bcryptjs")
// nodemon = node monitering

// import { Jwt } from "jsonwebtoken"

const jwt=require("jsonwebtoken")

const exp=require('express')

const expressAsyncHandler=require("express-async-handler")

const app=exp()

// assign port number

app.listen(3500,()=>{console.log("server is running")})



// connect to react app

app.use(exp.static(path.join(__dirname,'./build')))


// get mongo client
const mclient=require("mongodb").MongoClient


// import multer object
const multerObject=require('./Middlewares/cloudinaryConfig')

// connect to databse using mongo client


mclient
.connect('mongodb://127.0.0.1:27017')
.then((dbRef)=>{
    // connect to database
      const dbObj=dbRef.db("TourVista")

    // // connect to collections

    const userCollectionObj=dbObj.collection("userscollection")
    const guidersCollectionObj=dbObj.collection("guiderscollection")
    const placesCollectionObj=dbObj.collection("placescollection")
    const destinationCollectionObj=dbObj.collection("viewdestinationcollection")
    const imagesCollectionObj=dbObj.collection("imagescollection")
    const guidersrequestCollectionObj=dbObj.collection("guidersrequest")
    const preferenceCollectionObj=dbObj.collection("preferenceCollection")
    const guiderPreferencesCollectionObj=dbObj.collection("guiderPreferences")
    const BookingGuidersCollectionObj=dbObj.collection("BookingGuidersCollection")
    const ratingsCollectionObj=dbObj.collection("ratingscollection")

    // // connect to apis
    app.set("userCollectionObj",userCollectionObj)
    app.set("guidersCollectionObj",guidersCollectionObj)
    app.set("placesCollectionObj",placesCollectionObj)
    app.set("destinationCollectionObj",destinationCollectionObj)
    app.set("imagesCollectionObj",imagesCollectionObj)
    app.set("guidersrequestCollectionObj",guidersrequestCollectionObj)
    app.set("preferenceCollectionObj",preferenceCollectionObj)
    app.set("guiderPreferencesCollectionObj",guiderPreferencesCollectionObj)
    app.set("BookingGuidersCollectionObj",BookingGuidersCollectionObj)
    app.set("ratingsCollectionObj",ratingsCollectionObj)
  
    console.log("DB connection success")
})
.catch(err=>console.log("Database connect error",err))


const sendEmail=require('./Middlewares/sendmail')
const nodemailer=require("nodemailer")
const { GiMailShirt } = require("react-icons/gi")
const { count } = require("console")

// body parser
app.use(exp.json())





// user signup
app.post('/user-signup',multerObject.single('photo'),expressAsyncHandler(async(request,response)=>{
  
  const { name, password,Email } = request.body.user;
  console.log("in request of user-signup")
  const Userobj=JSON.parse(request.body.user);
  
  console.log(Userobj)
  const Sender_Email=Userobj.Email
  console.log(Sender_Email)

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anangipavan2427@gmail.com',
    pass: 'gppp rnwr jkkg tvez'
  }
 });

var mailOptions = {
  from: 'anangipavan2427@gmail.com',
  to: Sender_Email,
  subject: 'Welcome to Journey Jive',
  text: ` Dear ${Userobj.name} Thank you for signing to Journey Jive`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

      let newuser=JSON.parse(request.body.user);
      console.log(newuser)
      // get user collection
      const userCollectionObj=request.app.get("userCollectionObj");
      console.log(newuser.name)
      const userobj=await userCollectionObj.findOne({name:newuser.name})
      console.log(userobj)
      // checking duplicate
      if(userobj!=null){
          response.status(200).send({message:"user already existed"})
      }
      // not existed
      else{
          let hashedpassword=await bcryptjs.hash(newuser.password,5)   
          console.log(hashedpassword)  ;
      //    replace old password with hashed one
          newuser.password=hashedpassword;
            //    add CDN of cloudinary image to user obj
            let sampleObj=JSON.parse(request.body.user)

   
            // File URL is available as request.file.path
            const imageUrl = request.file?.path;
            console.log("Image URL:", imageUrl);
            console.log(request.body)
            newuser.image=imageUrl;
            console.log("img is",newuser.image)
         
         try {
          const dbRes = await userCollectionObj.insertOne(newuser);
          console.log("Database Insertion Result:", dbRes);
          // Log the number of documents
          const count = await userCollectionObj.countDocuments();
          console.log("Total documents count:", count);

          // Fetch and log the documents
          const documents = await userCollectionObj.find({}).toArray();
          console.log("Documents:", documents);

          response.status(201).send({ message: "New user created" });
        } catch (err) {
          console.error("Database Insertion Error:", err);
          response.status(500).send({ message: "Error creating user" });
        }
      }
  }))


// guider signup
app.post('/guider-signup',multerObject.single('photo'),expressAsyncHandler(async(request,response)=>{
  // get user obj from req
  console.log(request.body)
      let newuser=JSON.parse(request.body.user);
      console.log(newuser)
      // get user collection
      const guidersCollecitonObj=request.app.get("guidersCollectionObj");
      console.log(newuser.name)
      const guidersobj=await guidersCollecitonObj.findOne({name:newuser.name})
      console.log(guidersobj)
      // checking duplicate
      if(guidersobj!=null){
          response.status(200).send({message:"user already existed"})
      }
      // not existed
      else{


          let hashedpassword=await bcryptjs.hash(newuser.password,5)   
          console.log(hashedpassword)  ;
      //    replace old password with hashed one
          newuser.password=hashedpassword;
            //    add CDN of cloudinary image to user obj
            let sampleObj=JSON.parse(request.body.user)
            
            // File URL is available as request.file.path
  const imageUrl = request.file?.path;
  console.log("Image URL:", imageUrl);
    console.log(request.body)
  newuser.image=imageUrl;
  console.log("img is",newuser.image)

    newuser.image=imageUrl;

      console.log(newuser.image)
           // adding user
         let dbres= await guidersCollecitonObj.insertOne(newuser)
          
    
      response.status(201).send({messege:"new user created"})
      }
  }))


 


//search destination by name
app.get('/search-destination/:name', expressAsyncHandler(async (request, response) => {
  try {
    const destinationName = request.params.name; 
    console.log('Destination Name:', destinationName);

    // Get the places collection object from the app
    const placesCollectionObj = request.app.get("placesCollectionObj");

    // Check if the destinationName is provided
    if (!destinationName) {
      return response.status(400).send({ message: "Destination name is required" });
    }

   // const destinationObj = await placesCollectionObj.findOne({ name: { $regex: `^${destinationName}$`, $options: 'i' } });
    
    const destinationObj = await placesCollectionObj.findOne({ name:destinationName});

    console.log(destinationObj)
    if (!destinationObj) {
      // If destination not found, send a response with status 404 and message
      return response.status(404).send({ message: "Destination not found" });
    }

    // If destination found, send a response with status 200 and the destination object
    response.status(200).send({ message: "Destination found", payload: destinationObj });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));

//view-destination 
app.get('/view-destination/:name', expressAsyncHandler(async (request, response) => {
  try {
    const destinationName = request.params.name; 
    console.log('Destination Name:', destinationName);

    const placesCollectionObj = request.app.get("placesCollectionObj");

    if (!destinationName) {
      return response.status(400).send({ message: "Destination name is required" });
    }

    // // Create a regex pattern to handle extra spaces
    // const regexPattern = destinationName.split(' ').map(part => `\\s*${part}`).join('.*?');
    // const regex = new RegExp(regexPattern, 'i');

    const destinationObj = await placesCollectionObj.findOne({ name:destinationName});

    console.log(destinationObj);

    if (!destinationObj) {
      return response.status(404).send({ message: "Destination not found" });
    }

    response.status(200).send({ message: "Destination found", payload: destinationObj });
  } catch (error) {
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));




//destination-images
app.post('/destination-images', expressAsyncHandler(async (request, response) => {
  try {
    const destinationName = request.body.name;
    console.log("in request of destination images request")
    console.log('Destination Name:', destinationName);

    // Get the images collection object from the app
    const imagesCollectionObj = request.app.get("imagesCollectionObj");

    // Check if the destinationName is provided
    if (!destinationName) {
      return response.status(400).send({ message: "Destination name is required" });
    }

    // Find the destination object in the database by name
    const destinationObj = await imagesCollectionObj.findOne({ name: destinationName });

    console.log(destinationObj);

    if (!destinationObj) {
      // If destination not found, send a response with status 404 and message
      response.status(404).send({ message: "Destination not found" });
    } else {
      const list_images = destinationObj.imgs;

      // If destination found, send a response with status 200 and the destination object
      response.status(200).send({ message: "Destination found", payload: list_images });
    }
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));




//destinationImages
app.post('/destinationImages',multerObject.single('photo'), expressAsyncHandler(async (request, response) => {
  try {
    console.log("in detination images request")
    console.log(request.body)
    const destinationImagePath = request.file.path;
    console.log('Destination Image:', destinationImagePath);
    const destinationImageName=(request.body.name);

    console.log(destinationImageName)

    // Get the images collection object from the app
    const imagesCollectionObj = request.app.get("imagesCollectionObj");

     // Create a case-insensitive regex for the destination name
     //const destinationNameRegex = new RegExp(`^${destinationImageName}$`, 'i');
    
   //  const DestinationimageObj = await imagesCollectionObj.findOne({ name: destinationNameRegex });
 
   //  console.log(DestinationimageObj);
    const DestinationimageObj=await imagesCollectionObj.findOne({name:destinationImageName})

    console.log(DestinationimageObj)

     // Use updateOne with upsert option to update or insert the document
         // Use updateOne with upsert option to update or insert the document
    // const result = await imagesCollectionObj.updateOne(
    //   { name: destinationNameRegex },
    //   { $push: { imgs: destinationImagePath } },
    //   { upsert: true } // Insert the document if it doesn't exist
    // );

     const result = await imagesCollectionObj.updateOne(
      { name: destinationImageName },
      { $push: { imgs: destinationImagePath} },
      { upsert: true } // Insert the document if it doesn't exist
    );
    response.status(200).send({ message: "Destination added" });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));





  // body parser
  app.use(exp.json())

  // user login request
// public route
app.post('/user-login',expressAsyncHandler(async(request,response)=>{
  console.log(request.headers)
  // console.log(request.body.user)
  // get collection
  const userCollectionObj=request.app.get("userCollectionObj");
  // get user credentails
  const userCredObj=request.body;
  console.log(userCredObj)
  // verify user
  let userDBObj=await userCollectionObj.findOne({name:userCredObj.name})
  // if name invalid
  console.log(userDBObj)
  if(userDBObj===null){
      response.status(200).send({message:"username invalid"})
  }
  // if name is valid
  else{
      // verify password
      let isEqual=await bcryptjs.compare(userCredObj.password,userDBObj.password);
      // if password not matched
      if(isEqual===false){
          response.status(201).send({message:"Invalid password"})
      }
      else{
          // if password matched
          // create a jwt(json web token)

          console.log(userDBObj)

          let jwtToken=jwt.sign({name:userDBObj.name},"absdcdh",{expiresIn:'100s'})
          response.status(200).send({message:"Valid user",token:jwtToken,user:userDBObj})
      }
  }
}))


  // user login request
// public route
app.post('/guider-login',expressAsyncHandler(async(request,response)=>{
  console.log("in request of guider login")
  console.log(request.headers)
  // console.log(request.body.user)
    // get user collection
    const guidersCollectionObj=request.app.get("guidersCollectionObj");
  // get user credentails
  const userCredObj=request.body;
  console.log(userCredObj)
  // verify user
  let userDBObj=await guidersCollectionObj.findOne({name:userCredObj.name})
  // if name invalid
  console.log(userDBObj)
  if(userDBObj===null){
      response.status(200).send({message:"username invalid"})
  }
  // if name is valid
  else{
      // verify password
      let isEqual=await bcryptjs.compare(userCredObj.password,userDBObj.password);
      // if password not matched
      if(isEqual===false){
          response.status(201).send({message:"Invalid password"})
      }
      else{
          // if password matched
          // create a jwt(json web token)

          let jwtToken=jwt.sign({name:userDBObj.name},"absdcdh",{expiresIn:100})
          response.status(200).send({message:"Valid user",token:jwtToken,user:userDBObj})
      }
  }
}))



//fetch guiders-data
app.post('/guiders-data', expressAsyncHandler(async (request, response) => {
  try {
      
        console.log(request.body)
        const PlaceObj=request.body.search_place;
        console.log(PlaceObj)
        // get user collection
        const guiderPreferencesCollectionObj=request.app.get("guiderPreferencesCollectionObj");

        const guidersCollectionObj = request.app.get("guidersCollectionObj");


         // Find the document with the matching placeName
    const placeDoc = await guiderPreferencesCollectionObj.findOne({ placeName: PlaceObj });

     // Find the document with the matching placeName (case-insensitive)
   //  const placeNameRegex = new RegExp(`^${PlaceObj}$`, 'i'); // Changed line

    // const placeDoc = await guiderPreferencesCollectionObj.findOne({ placeName: placeNameRegex }); // Changed line
     console.log(placeDoc)
    console.log(placeDoc)
    if (placeDoc) {
      

       // If the document is found, fetch the guider details based on guider IDs
       const guiderIds = placeDoc.guiders.map(id => new ObjectId(id)); // Convert guider IDs to ObjectId
       const guiderDetails = await guidersCollectionObj.find({ _id: { $in: guiderIds } }).toArray();
 
       // Map guider details to required format
       const guiderData = guiderDetails.map(guider => ({
         id: guider._id.toString(), // Convert ObjectId to string
         name: guider.name,
         Email: guider.Email
       }));
 
       // Send the response with the guider details
       response.status(200).send({ message: "Guiders found", payload: guiderData });


    } else {
      // If the document is not found, return an empty array or an appropriate message
      response.status(404).send({ message: "No guiders found for the specified place", payload: [] });
    }

  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));


//submit ratings
app.post('/rate-destination', expressAsyncHandler(async (request, response) => {
  try {
    console.log(request.body);
    console.log("In request of submit rating rate-destination");

    const placeObj = request.body.placeObj;
    const rating_value = request.body.rating_value;
    const Userobj = request.body.Userobj;

    const ratingData = {
      placeObj: placeObj,
      rating_value: rating_value,
      Userobj: Userobj
    };

    const ratingsCollectionObj = request.app.get("ratingsCollectionObj");
    console.log(ratingData)
    // Check if the combination of user_id and placeObj._id already exists in the collection
    const existingRating = await ratingsCollectionObj.findOne({
      'Userobj._id': Userobj._id,
      'placeObj._id': placeObj._id
    });

    if (existingRating) {
      // If a match is found, update the rating_value
      const result = await ratingsCollectionObj.updateOne(
        { _id: existingRating._id },
        { $set: { rating_value: rating_value } }
      );
      response.status(200).send({ message: "Rating updated successfully", result });
    } else {
      // If no match is found, insert the new ratingData
      const result = await ratingsCollectionObj.insertOne(ratingData);
      response.status(201).send({ message: "Rating submitted successfully", result });
    }

  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));

//fetching average ratings
app.get('/average-rating/:placeId/:userId', expressAsyncHandler(async (request, response) => {
  try {
    console.log("in fetching average rating")
    const placeId = request.params.placeId;
    const userId = request.params.userId;

    const ratingsCollectionObj = request.app.get("ratingsCollectionObj");

    // Find all ratings for the given placeId and userId
    const ratings = await ratingsCollectionObj.find({
      'placeObj._id': placeId
    }).toArray();

    if (ratings.length === 0) {
      return response.status(404).send({ message: "No ratings found for this place and user." });
    }

    // Calculate the average rating
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating_value, 0);
    const averageRating = (totalRating / ratings.length).toFixed(2);

    response.status(200).send({ averageRating: averageRating });
  } catch (error) {
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));


//user rating
app.post('/user-rating', expressAsyncHandler(async (request, response) => {
  try {
    const { placeObj, Userobj } = request.body;

    const ratingsCollectionObj = request.app.get("ratingsCollectionObj");

    // Find the user's rating for the given placeId and userId
    const userRating = await ratingsCollectionObj.findOne({
      'placeObj._id': placeObj._id,
      'Userobj._id': Userobj._id
    });

    if (!userRating) {
      return response.status(404).send({ message: "User has not rated this place." });
    }

    response.status(200).send({ userRating: userRating.rating_value });
  } catch (error) {
    console.error('Error:', error);
    response.status(500).send({ message: "Internal server error" });
  }
}));





// Middleware to parse JSON bodies
app.use(exp.json());

//request data
app.post('/request-data', expressAsyncHandler(async (req, res) => {
  const guiderId = req.body._id; // Assuming guiderId is sent from frontend
  console.log("In request data of users for the guiders");
  console.log(req.body)

  console.log(guiderId);

  const BookingGuidersCollectionObj = req.app.get("BookingGuidersCollectionObj");

  try {
    // Find all bookings where the guider with the given guiderId has status "requested" or "Accepted"
    const matchedBookings = await BookingGuidersCollectionObj.find({
      'guider': {
        $elemMatch: {
          id: guiderId,
          status: { $in: ['requested', 'Accepted'] }
        }
      }
    }).toArray(); // Convert the cursor to an array

    console.log("Matched records:", matchedBookings);
    if (matchedBookings.length > 0) {
      // Extract user names, place names, and status from all matched bookings
      const responseData = matchedBookings.map(booking => {
        // Find the guider object for the given guiderId to get the status
        const guider = booking.guider.find(g => g.id === guiderId);
        return {
          userObj: booking.user, // Extracting the user object
          place: booking.place, // Assuming place is directly available in the booking
          status: guider.status // Extracting the status
        };
      });

      console.log(responseData);
      // Respond with the array of user names and places
      res.status(200).json({ payload: responseData });
    } else {
      // Respond with an error if no matching bookings found
      res.status(204).json({ message: 'No bookings found with the provided guider ID and status "requested".' });
    }
  } catch (error) {
    console.error('Error finding bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));


//request-updated-data
app.post('/request-updated-data', expressAsyncHandler(async (req, res) => {
  const { guiderobj, userobj, place } = req.body; // Assuming obj of three guider, user and place is sent from frontend
  console.log("In request updated data of users for the guiders");
  console.log("Userobj:", userobj);
  console.log("Guiderobj:", guiderobj);
  console.log("Place:", place);

  const BookingGuidersCollectionObj = req.app.get("BookingGuidersCollectionObj");

  try {
    // Find all bookings where the guider with the given guiderId has status "requested" or "Accepted"
    const matchedBookings = await BookingGuidersCollectionObj.find({
      'guider': {
        $elemMatch: {
          id: guiderobj._id,
          status: { $in: ['requested', 'Accepted'] }
        }
      }
    }).toArray(); // Convert the cursor to an array

    console.log("Matched records:", matchedBookings);

    if (matchedBookings.length > 0) {
      // Extract user names and place names from all matched bookings
      const responseData = matchedBookings.map(booking => ({
        userName: booking.user,
        place: booking.place, // Assuming place is directly available in the booking
        status: booking.user._id === userobj._id ? "Accepted" : booking.guider[0].status, // Set status to "Accepted" if userId matches
        guider_id: guiderobj._id // Include guider_id in the response
      }));

      console.log("Response data:", responseData);

      // Respond with the array of user names, places, statuses, and guider_id
      res.status(200).json({ payload: responseData });
    } else {
      // Respond with an error if no matching bookings found
      res.status(204).json({ message: 'No bookings found with the provided guider ID and status "requested".' });
    }
  } catch (error) {
    console.error('Error finding bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));


//request for accept
app.post('/accept-request', expressAsyncHandler(async (request, response) => {
  try {
    const BookingGuidersCollectionObj = request.app.get("BookingGuidersCollectionObj");
    console.log("In accept request of guiders to the users");

    // Extract necessary information from the request body
    const { userObj, place, guider_id } = request.body;

    console.log("user", userObj);
    console.log("place", place);
    console.log("guider id", guider_id);

    // Update the status in BookingGuidersCollection
    const result = await BookingGuidersCollectionObj.updateOne(
      { 
        "user._id": userObj._id,
        "place": place,
        "guider.id": guider_id 
      },
      { 
        $set: { "guider.$.status": "Accepted" } 
      }
    );

    console.log(result);

    if (result.modifiedCount > 0) {
      response.status(200).json({ message: 'Request accepted successfully.' });
    } else {
      response.status(404).json({ error: 'Booking record not found or already updated.' });
    }
  } catch (error) {
    console.error('Error updating request status:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}));


module.exports = app;




const { ObjectId } = require('mongodb');
const { verify } = require("crypto")
const { CloudinaryStorage } = require("multer-storage-cloudinary")


//guider-requests
app.post('/guider-requests', expressAsyncHandler(async (request, response) => {
  const guidersrequestCollectionObj = request.app.get("guidersrequestCollectionObj");
  const guidersCollectionObj = request.app.get("guidersCollectionObj");
  const guiderCredObj = request.body;

  // Convert _id to ObjectId
  const guiderId = new ObjectId(guiderCredObj._id);

  try {
    // Find the guider by ID in the guider request collection
    let guider = await guidersrequestCollectionObj.findOne({ _id: guiderId });

    // If guider is not found in guider request collection, find it in guider collection
    if (!guider) {
      guider = await guidersCollectionObj.findOne({ _id: guiderId });

      // If guider is still not found, return 404
      if (!guider) {
        return response.status(404).send({ message: "Guider not found." });
      }

      // If found in guider collection, set default status and initialize user array
      guider.status = "requested";
      guider.user = [];
    }

    // Convert guiderCredObj.user to an object
    const UserObj = JSON.parse(guiderCredObj.user);

    // Check if the user already exists in the guider.user array
    const existingUser = guider.user.find(u => u._id === UserObj._id);

    if (!existingUser) {
      // Add user with status requested
      UserObj.status = "requested";
      guider.user.push(UserObj);
    }

    // Update the guider document in the guider requests collection
    const result = await guidersrequestCollectionObj.updateOne({ _id: guiderId }, { $set: guider }, { upsert: true });

    if (result.modifiedCount === 1 || result.upsertedCount === 1) {
      console.log("Guider document updated/inserted successfully.");
    } else {
      console.log("Document not found or no changes made.");
    }

    response.status(200).send({ message: "Guider request processed." });
  } catch (error) {
    console.error("Error processing guider request:", error);
    response.status(500).send({ message: "Internal server error." });
  }
}));


//available-places
app.get('/available-places', expressAsyncHandler(async (request, response) => {
  const preferenceCollectionObj = request.app.get("preferenceCollectionObj");
  console.log("Places fetched successfully")
  try {
    const places = await preferenceCollectionObj.find().toArray();
    response.status(200).send({ places });
  } catch (error) {
    console.error('Error fetching available places:', error);
    response.status(500).send({ message: 'Error fetching available places' });
  }
}));


//guider-saved-preferences
app.put('/guider-saved-preferences', expressAsyncHandler(async (req, res) => {
  const guiderPreferencesCollectionObj = req.app.get("guiderPreferencesCollectionObj");
  const BookingGuidersCollectionObj = req.app.get("BookingGuidersCollectionObj");
  const guidersCollectionObj = req.app.get("guidersCollectionObj");

  const { guiderId, preferences } = req.body;
  const guiderObjectId = new ObjectId(guiderId); // Convert guiderId to ObjectId

  // Fetch the complete guider object from the GuidersCollectionObj
  const guiderObject = await guidersCollectionObj.findOne({ _id: guiderObjectId });

  if (!guiderObject) {
    return res.status(404).json({ message: 'Guider not found' });
  }

  // Add status 'created' to the guider object
  guiderObject.status = 'created';
  console.log("Guider saved preferences collection fetched successfully");

  try {
    console.log(`Guider ID: ${guiderId}`);
    console.log(`Preferences: ${JSON.stringify(preferences)}`);

    for (const pref of preferences) {
      // Check if the preference already exists
      const existingPreference = await guiderPreferencesCollectionObj.findOne({ placeName: pref });


      if (existingPreference) {
        // Convert all guider ids in existingPreference to strings
        existingPreference.guiders = existingPreference.guiders.map(id => id.toString());
      
        // Update existing preference by adding the guiderId if not already present
        if (!existingPreference.guiders.includes(guiderId)) {
          existingPreference.guiders.push(guiderId);
          await guiderPreferencesCollectionObj.updateOne(
            { _id: existingPreference._id },
            { $set: { guiders: existingPreference.guiders } }
          );
        }
      } else {
        // Create new preference entry with guiderId as a string
        await guiderPreferencesCollectionObj.insertOne({
          placeName: pref,
          guiders: [guiderId],
        });
      }
      
    

      // Update the BookingGuidersCollectionObj
      const bookings = await BookingGuidersCollectionObj.find({ place: pref }).toArray();

      console.log("The bookings array is", bookings);

      for (const booking of bookings) {
        const bookingGuidersList = booking.guider;

        console.log("The each booking is", booking);

        // Check if the guider is already present in the booking guiders list
        const isGuiderPresent = bookingGuidersList.some(g => new ObjectId(g.id).equals(guiderObjectId));

        if (!isGuiderPresent) {
          // Transform guiderObject to include only necessary keys
          const newGuiderObject = {
            id: guiderObject._id.toString(),
            name: guiderObject.name,
            Email: guiderObject.Email,
            status: 'created'
          };

          // Push the transformed guider object to the booking's guider list
          booking.guider.push(newGuiderObject);
          console.log("updated booking is", booking);
          console.log(booking.guider);

          // Update the booking in the collection
          await BookingGuidersCollectionObj.updateOne(
            { _id: booking._id },
            { $set: { guider: booking.guider } }
          );
        }
      }
    }

    res.status(200).json({ message: 'Preferences saved successfully!' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));


// Endpoint to fetch guider's previous preferences
app.post('/guider-previous-preferences', async (req, res) => {
  const { guiderId } = req.body;
  console.log("Received request to fetch guider previous saved preferences");
  console.log("GuiderId is", guiderId);
  const guiderPreferencesCollectionObj = req.app.get("guiderPreferencesCollectionObj");
  try {
    // Find documents where guiders array contains guiderId
    const preferences = await guiderPreferencesCollectionObj.find({ "guiders": guiderId }).toArray();
    console.log("Preferences found:", preferences);
    // Extract placeNames from matching documents
    const preferredPlaces = preferences.map(preference => preference.placeName);
    res.status(200).json({ preferredPlaces });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//deleting the guiders from the non selected places
app.delete('/remove-guider-from-places', async (req, res) => {
  const guidersCollectionObj=req.app.get("guidersCollectionObj")
  const BookingGuidersCollectionObj = req.app.get("BookingGuidersCollectionObj");
  console.log("in delete request of gudiers non selected places")
     
  const { guiderId, nonSelectedPlaces} = req.body;

  //  Fetch the complete guider object from the GuidersCollectionObj
const guiderObject = await guidersCollectionObj.findOne({ _id: new ObjectId(guiderId) });

if (!guiderObject) {
  return res.status(404).json({ message: 'Guider not found' });
}

  
  console.log("Received request to remove guider from unselected places");
  console.log("GuiderId is", guiderId);
  console.log("Non-selected places are", nonSelectedPlaces);

  const guiderPreferencesCollectionObj = req.app.get("guiderPreferencesCollectionObj");

  try {
    // Update documents to remove guiderId from the guiders array for each non-selected place
    await guiderPreferencesCollectionObj.updateMany(
      { placeName: { $in: nonSelectedPlaces } },
      { $pull: { guiders: guiderId } }


      
    );
    console.log("guider is",guiderId)
      // Iterate through each non-selected place
    for (const place of nonSelectedPlaces) {
      console.log("place is",place)
      // Update document to remove guiderId from the guider array for the non-selected place
      await BookingGuidersCollectionObj.updateMany(
        { place, 'guider.id': guiderId },
        { $pull: { guider: { id: guiderId } } }
      );
    }

    res.status(200).json({ message: 'Guider removed from non-selected places successfully' });
  } catch (error) {
    console.error('Error removing guider from non-selected places:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// // request for guider bookigs
app.post('/Booking-Guiders', expressAsyncHandler(async (request, response) => {
  try {
    // Log the incoming request body for debugging
    console.log(request.body);

    const BookingGuidersCollectionObj = request.app.get("BookingGuidersCollectionObj");

    // Extract user and place from the request body
    const { user, place } = request.body;

    // Check if the place and user already exist in the collection
    const existingBooking = await BookingGuidersCollectionObj.findOne({ "user._id": user._id, place });

    if (existingBooking) {
      // If booking already exists, return a 200 status with a message
      console.log("Booking already exists for this user and place");
      return response.status(200).send({ message: 'Booking already exists for this user and place' });
    } else {
      // Insert the request body into the collection
      const result = await BookingGuidersCollectionObj.insertOne(request.body);

      // Log success message with the inserted result
      console.log("Booking details added successfully:", result);

      // Return a 201 status with success message
      return response.status(201).send({ message: 'Booking details added successfully' });
    }
  } catch (error) {
    // Catch and log any errors that occur during booking process
    console.error('Error while booking:', error);
    return response.status(500).send({ message: 'Error booking guider', error });
  }
}));


// booking specific guider
app.post('/confirm-booking', expressAsyncHandler(async (request, response) => {
  try {
    console.log("In confirm booking guider request");
    console.log(request.body);

    const BookingGuidersCollectionObj = request.app.get("BookingGuidersCollectionObj");

    // Extract user, place, and guider_obj from the request body
    const { user, place, guider_obj } = request.body;

    // Find the booking in the collection based on user and place
    const booking = await BookingGuidersCollectionObj.findOne({ "user._id": user._id, place });

    if (!booking) {
      // If no booking found, return a 404 status with a message
      console.log("Booking not found for user and place");
      return response.status(404).send({ message: 'Booking not found for user and place' });
    }

    // Update the status of the specific guider in the booking's guider array
    const updatedGuiders = booking.guider.map(guider => {
      if (guider.id === guider_obj.id) {
        return { ...guider, status: 'requested' };
      }
      return guider;
    });

    // Save the updated booking back to the collection
    const result = await BookingGuidersCollectionObj.updateOne(
      { "_id": booking._id },
      { $set: { guider: updatedGuiders } }
    );

    console.log("Booking confirmed successfully:", result);

    // Return a success message with a 200 status
    return response.status(200).send({ message: 'Booking confirmed successfully' });

  } catch (error) {
    // Catch and log any errors that occur during booking confirmation process
    console.error('Error while confirming booking:', error);
    return response.status(500).send({ message: 'Error confirming booking', error });
  }
}));

//get-booking-status
app.post('/get-booking-status', expressAsyncHandler(async (request, response) => {
  try {
    console.log("In booking status of all guiders");
    console.log(request.body);

    const BookingGuidersCollectionObj = request.app.get("BookingGuidersCollectionObj");

    // Extract user, place, and guider_obj from the request body
    const { user, place} = request.body;

    // Find the booking in the collection based on user and place
    const booking = await BookingGuidersCollectionObj.findOne({ "user._id": user._id, place });

      // If booking is found, return the guiders list
      if (booking) {
        const guiders = booking.guider;
        response.status(200).send(guiders);
      } else {
        // If no booking is found, return an empty array or an appropriate message
        response.status(404).send({ message: 'No booking found for this user and place' });
      }
    
  } catch (error) {
    // Catch and log any errors that occur during booking confirmation process
    console.error('Error while confirming booking:', error);
    return response.status(500).send({ message: 'Error confirming booking', error });
  }
}));




// // updating booking Guider collection 
app.get('/update-BookingGuidersCollection', expressAsyncHandler(async (request, response) => {
  try {
    console.log("In bookingGuiderCollection");

    const BookingGuidersCollectionObj = request.app.get("BookingGuidersCollectionObj");
    const guiderPreferencesCollectionObj = request.app.get("guiderPreferencesCollectionObj");

    // Fetch all documents from both collections
    const bookingGuiders = await BookingGuidersCollectionObj.find().toArray();
    const guiderPreferences = await guiderPreferencesCollectionObj.find().toArray();

    // Create a map of placeName to guiders for guiderPreferences
    const guiderPreferencesMap = new Map();
    guiderPreferences.forEach(pref => {
      guiderPreferencesMap.set(pref.placeName, pref.guiders);
    });

    // Array to store updated booking guiders
    const updatedBookingGuiders = [];

    // Iterate through each booking in the bookingGuiders collection
    for (let booking of bookingGuiders) {
      const placeName = booking.place;
      const bookingGuidersList = booking.guider;

      if (guiderPreferencesMap.has(placeName)) {
        const preferredGuidersList = guiderPreferencesMap.get(placeName);

        // Find guiders to be removed
        const guidersToRemove = bookingGuidersList.filter(guider => 
          !preferredGuidersList.some(prefGuider => prefGuider.id === guider.id)
        );

        // Find guiders to be added
        const guidersToAdd = preferredGuidersList.filter(prefGuider => 
          !bookingGuidersList.some(guider => guider.id === prefGuider.id)
        );

        // Remove guiders
        if (guidersToRemove.length > 0) {
          guidersToRemove.forEach(guider => {
            const index = booking.guider.findIndex(g => g.id === guider.id);
            if (index > -1) {
              booking.guider.splice(index, 1);
            }
          });
        }

        // Add guiders
        if (guidersToAdd.length > 0) {
          guidersToAdd.forEach(guider => {
            guider.status = 'created';
            booking.guider.push(guider);
          });
        }

        // Ensure the number of guiders in booking collection matches the preferences collection
        while (booking.guider.length > preferredGuidersList.length) {
          booking.guider.pop();
        }

        // Update the booking in the collection
        await BookingGuidersCollectionObj.updateOne(
          { _id: booking._id },
          { $set: { guider: booking.guider } }
        );

        // Push the updated booking to the array
        updatedBookingGuiders.push(booking);
      }
    }

    // Respond with the updated bookings
    response.status(200).json({ message: 'Booking guiders collection updated successfully', updatedBookings: updatedBookingGuiders });

  } catch (error) {
    // Catch and log any errors that occur during booking confirmation process
    console.error('Error while confirming booking:', error);
    return response.status(500).send({ message: 'Error confirming booking', error });
  }
}));

//get-userprofile
app.post('/get-userprofile', expressAsyncHandler(async (request, response) => {
  try {
    console.log("In userprofile details request");
    console.log(request.body);
    const userCollecitonObj = request.app.get("userCollecitonObj");
    const obj=request.body
  //  const Userobj=userCollecitonObj.find({ "_id": obj._id})
  const userCollectionObj = request.app.get("userCollectionObj");

  const userObjectId = new ObjectId(obj._id);

  // Fetch user details from the database using user ID
  const userDetails = await userCollectionObj.findOne({ "_id": userObjectId});
  console.log(userDetails)

  if (userDetails) {
    response.status(200).send({ message: 'User found',user:userDetails});
  } else {
    response.status(404).send({ message: 'User not found'});
  }
  
  } catch (error) {
    // Catch and log any errors that occur during booking confirmation process
    console.error('Error while confirming booking:', error);
    return response.status(500).send({ message: 'Error getting user details', error });
  }
}));


// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


// middleware to deal with refresh page
const pageRefresh=(request,response,next)=>{
    response.sendFile(path.join(__dirname,'./build/index.html'))
    }
    
    app.use("/*",pageRefresh)
    
