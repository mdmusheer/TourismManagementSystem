import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import './UserProfile.css';
import { useForm } from 'react-hook-form';
import GuideModal from '../guidermodel/Guidermodel';

function UserProfile() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [guiderData, setGuiderData] = useState(null);
  const [User_details,setUser_details]=useState(null)
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [err,setErr]=useState('')
  const [showAllImages, setShowAllImages] = useState(false); // State to toggle all images view
  const [tokenExpired, setTokenExpired] = useState(false); // State to track token expiration
  const [userRating, setUserRating] = useState(null); // Store user's previous rating
 // const [placeobj,setPlaceObj]

  let { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();

  useEffect(() => {
    if (place) {
      fetchImages(place);
    }
  }, [place]);
  

  useEffect(()=>{
    const obj=JSON.parse(localStorage.getItem('user'));
    console.log(obj)
    axios.post("http://localhost:3500/get-userprofile",obj)
    .then(res=>{
      console.log(res)
      if(res.status==200){
        console.log(res.data.message)
        setUser_details(res.data.user)
        console.log("user obj is",User_details)
      }
    })

    const savedQuery = localStorage.getItem('destinationQuery');
    if (savedQuery) {
      setQuery(savedQuery); // Set the query from localStorage to state
     // handleSearch(); // Optionally, trigger a search automatically
    }
    
  },[])

  useEffect(() => {
    if (place && User_details) {
      fetchAverageRating(place._id, User_details.user_id);
      fetchUserRating(place, User_details); 
    }
  }, [place, User_details,query]); // Dependencies: rerun effect if placeObj or Userobj changes

  useEffect(() => {
    if (query) {
      handleSearch(); // Trigger a search automatically once the query is set
    }
  }, [query]);

  useEffect(() => {
    if (User_details) {
      console.log("user obj is", User_details);
    }
  }, [User_details]);

  const fetchImages = async (PlaceObj) => {
    try {
      const response = await axios.post('http://localhost:3500/destination-images', PlaceObj);
      if (response.status === 200) {
       setImages(response.data.payload || []); // Ensure payload is an array
      }
      else if(response.status === 404){
        console.log("Review images are null")
        setImages([]);
      }
    } catch (error) {
      console.error("Internal server error");
      setImages([]);
    }
  };

  const ViewPlace = async (PlaceObj) => {
    try {
      console.log("Place Obj is ",PlaceObj)
      console.log("search query is",query)
      const response = await axios.get(`http://localhost:3500/view-destination/${query}`);
      if (response.status === 200) {
        setPlace(response.data.payload);
        setShowDetailedView(true);
        setResults([])
        setError('');
        fetchImages(response.data.payload);
        if (place && User_details) {
          fetchAverageRating(place._id, User_details.user_id);
          fetchUserRating(place._id, User_details._id); // Fetch user's rating when viewing place details
        }
      } else {
        setError('Error: Unable to fetch data');
      }
    } catch (error) {
      console.error(error);
      setError('Error: Network issue or server is down');
    }
  };

  const fetchUserRating = async (placeObj, User_details) => {
    try {
        const response = await axios.post('http://localhost:3500/user-rating', {
            placeObj: placeObj,
            Userobj: User_details
        });
        
        if (response.status === 200) {
            setUserRating(response.data.userRating);
            setRating(response.data.userRating); // Set the rating state to the user's previous rating
        }
    } catch (error) {
        console.error("Error fetching user rating:", error);
    }
};

 

  const handleSearch = async () => {
    try {
      if(query){
        localStorage.setItem('destinationQuery', query); // Save query to localStorage
      const response = await axios.get(`http://localhost:3500/search-destination/${query}`);
      if (response.status === 200) {
        setResults([response.data.payload]); 
        setShowDetailedView(false)
        setError('');
      } else {
        setError('Error: Unable to fetch data');
      }
    }
    else{
      setError("Provide place name...")
    }
    } catch (error) {
      console.error(error);
      setError('Please enter the provided place names correctly...');
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
    console.log("In handle rating func",value)
    console.log(place)
    submitRating(place, value);
  };

  const submitRating = async (placeObj, rating_value) => {
    try {
      console.log("In submit rating request")
      const  Userobj=JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:3500/rate-destination', {placeObj,rating_value,Userobj});
      fetchAverageRating(placeObj._id, Userobj.user_id);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchAverageRating = async (placeId, userId) => {
    try {
      console.log("in func of average rating fecthing")
      // Fetch the average rating for the given placeId and userId
      const response = await axios.get(`http://localhost:3500/average-rating/${placeId}/${userId}`);
      setAverageRating(response.data.averageRating);
      console.log("Average Rating:", averageRating);
      // Update your UI or state with the average rating
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    let fd = new FormData();
    fd.append("name", query);
    fd.append("photo", file);
    try {
      const response = await axios.post("http://localhost:3500/destinationImages", fd);
      console.log(response);
      ViewPlace(place); // Refresh place details after upload
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookGuide = async (Search_Place) => {
    try {
      console.log(Search_Place);
      const response = await axios.post("http://localhost:3500/guiders-data", { search_place: Search_Place });
      if (response.status === 200) {
        setGuiderData(response.data.payload);
        console.log("guiders data", guiderData);
        setShowModal(true);
      } else {
        console.log("No data");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const closeModal = () => {
    setShowModal(false);
  };

  const handleToggleImages = () => {
    setShowAllImages(prevState => !prevState);
  };


  return (
    <div className="container">
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-5">
            <h1 className="display-4">Explore Destinations</h1>
            <span>(Munnar, Ooty, Araku, Kodaikanal, Ladakh, Taj Mahal, Gokarna, Manali, Lonavala, Chikkamagaluru)</span>
            {/* <p className="lead">Find your next adventure</p> */}
            <p className="lead fw-bold">Find your next adventure</p>

          </div>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Enter destination" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
          </div>
       
         {error&&<div className="alert alert-danger">{error}</div>}
        </div>
      </div>
     


      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4'>
        {results.map((obj) => (
          <div className='col mb-4' key={obj.id}>
            <div className='card custom-card shadow-sm'>
              <img src={obj.image} className='card-img-top' alt='Destination' />
              <div className='card-body'>
                <h5 className='card-title'>{obj.name}</h5>
                <p className='card-text'>
                  <a href={obj.Location} target="_blank" rel="noopener noreferrer">Location</a>
                </p>
                <p className='card-text'>Estimated Charges: {obj.Estimation_Cost}</p>
                <p className='card-text'>Address: {obj.Address}</p>
                <button className='btn btn-outline-primary' onClick={() => ViewPlace(obj)}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetailedView && place && (
        <div className='row justify-content-center mt-5'>
          <div className='col-md-6 mb-4'>
            <div className='card custom-card shadow-sm'>
              <img src={place.image} className='card-img-top2' alt='Destination' />
              <div className='card-body'>
                <h5 className='card-title'>{place.name}</h5>
                <p className='card-text'>
                  <a href={place.Location} target="_blank" rel="noopener noreferrer">Location</a>
                </p>
                <p className='card-text'>Estimated Charges: {place.Estimation_Cost}</p>
                <p className='card-text'>Average Rating: {averageRating}</p>
                <div className='mb-3'>
                  <h6 className='mb-0'>Rate</h6>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= rating ? "text-warning" : "text-secondary"}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRatingChange(star)}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                {/* {images && images.length > 0 ? (
        <div className='row justify-content-center'>
          {images.map((image, index) => (
            <div className='col-md-4 mb-4' key={index}>
              <img src={image} alt={`Image ${index}`} className='img-fluid' />
            </div>
          ))}
        </div>
      ) : (
        <p>No Review images.</p>
      )} */}
      <h3>Reveiwed images are:</h3>
        {images && images.length > 0 ? (
                    <div>
                      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                        {images.slice(0, showAllImages ? images.length : 3).map((image, index) => (
                          <div className="col mb-4" key={index}>
                            <div className="card">
                              <img src={image} className="card-reveiw-imgs" alt={`Image ${index + 1}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-link no-underline" onClick={handleToggleImages}>
                        {showAllImages ? "Show Less Images..." : `Show More Images...`}
                      </button>
                    </div>
                  ) : (
                    <p>No images available</p>
                  )}
                <div className='mb-3'>
                  <h6 className='mb-0'>Upload Images</h6>
                  <label className="btn btn-primary">
                    <input type="file" multiple onChange={handleImageUpload} hidden />
                    Add Images
                  </label>
                </div>
                <button className="btn btn-success" onClick={() => handleBookGuide(query)}>Book a Trip Guide</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <GuideModal show={showModal} handleClose={closeModal} guiderData={guiderData} query={query} />}

      <Outlet />
    </div>
</div>
  );
}

export default UserProfile;

 
















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Outlet } from 'react-router-dom';
// import './UserProfile.css';
// import { useForm } from 'react-hook-form';
// import GuideModal from '../guidermodel/Guidermodel';

// function UserProfile() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [place, setPlace] = useState(null);
//   const [error, setError] = useState('');
//   const [rating, setRating] = useState(0);
//   const [images, setImages] = useState([]);
//   const [showDetailedView, setShowDetailedView] = useState(false);
//   const [averageRating, setAverageRating] = useState(4.5);
//   const [guiderData, setGuiderData] = useState(null);
//   const [User_details,setUser_details]=useState(null)
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();
//   const [tokenExpired, setTokenExpired] = useState(false); // State to track token expiration

//   let { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();

//   useEffect(() => {
//     if (place) {
//       fetchImages(place);
//     }
//   }, [place]);
  

//   useEffect(()=>{
//     const obj=JSON.parse(localStorage.getItem('user'));
//     console.log(obj)
//     axios.post("http://localhost:3500/get-userprofile",obj)
//     .then(res=>{
//       console.log(res)
//       if(res.status==200){
//         console.log(res.data.message)
//         setUser_details(res.data.user)
//         console.log("user obj is",User_details)
//       }
//     })
    
//   },[])
//   useEffect(() => {
//     if (User_details) {
//       console.log("user obj is", User_details);
//     }
//   }, [User_details]);

//   const fetchImages = async (PlaceObj) => {
//     try {
//       const response = await axios.post('http://localhost:3500/destination-images', PlaceObj);
//       if (response.status === 200) {
//        setImages(response.data.payload || []); // Ensure payload is an array
//       }
//       else if(response.status === 404){
//         console.log("Review images are null")
//         setImages([]);
//       }
//     } catch (error) {
//       console.error("Internal server error");
//       setImages([]);
//     }
//   };

//   const ViewPlace = async (PlaceObj) => {
//     try {
//       console.log("Place Obj is ",PlaceObj)
//       console.log("search query is",query)
//       const response = await axios.get(`http://localhost:3500/view-destination/${query}`);
//       if (response.status === 200) {
//         setPlace(response.data.payload);
//         setShowDetailedView(true);
//         setError('');
//         fetchImages(response.data.payload);
//       } else {
//         setError('Error: Unable to fetch data');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Error: Network issue or server is down');
//     }
//   };

//   const fetchAverageRating = async (destinationId) => {

//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3500/search-destination/${query}`);
//       if (response.status === 200) {
//         setResults([response.data.payload]);
//         setError('');
//       } else {
//         setError('Error: Unable to fetch data');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Error: Network issue or server is down');
//     }
//   };

//   const handleRatingChange = (value) => {
//     setRating(value);
//     submitRating(place.id, value);
//   };

//   const submitRating = async (destinationId, rating) => {
//     try {
//       await axios.post('http://localhost:3500/rate-destination', {
//         destinationId,
//         userId: 'user123', // Replace with actual user ID
//         rating,
//       });
//       fetchAverageRating(destinationId);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     let fd = new FormData();
//     fd.append("name", query);
//     fd.append("photo", file);
//     try {
//       const response = await axios.post("http://localhost:3500/destinationImages", fd);
//       console.log(response);
//       // ViewPlace(place); // Refresh place details after upload
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleBookGuide = async (Search_Place) => {
//     try {
//       console.log(Search_Place);
//       const response = await axios.post("http://localhost:3500/guiders-data", { search_place: Search_Place });
//       if (response.status === 200) {
//         setGuiderData(response.data.payload);
//         console.log("guiders data", guiderData);
//         setShowModal(true);
//       } else {
//         console.log("No data");
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };


//   const closeModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <div className="container">
//     <div className="container mt-3">
//       <div className="row justify-content-center">
//         <div className="col-md-8">
//           <div className="text-center mb-5">
//             <h1 className="display-4">Explore Destinations</h1>
//             <span>(Munnar, Ooty, Araku, Kodaikanal, Ladakh, Taj Mahal, Gokarna, Manali, Lonavala, Chikkamagaluru)</span>
//             {/* <p className="lead">Find your next adventure</p> */}
//             <p className="lead fw-bold">Find your next adventure</p>

//           </div>
//           <div className="input-group mb-3">
//             <input type="text" className="form-control" placeholder="Enter destination" value={query} onChange={(e) => setQuery(e.target.value)} />
//             <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
//           </div>
//           {error && <div className="alert alert-danger">{error}</div>}
//         </div>
//       </div>
     


//       <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4'>
//         {results.map((obj) => (
//           <div className='col mb-4' key={obj.id}>
//             <div className='card custom-card shadow-sm'>
//               <img src={obj.image} className='card-img-top' alt='Destination' />
//               <div className='card-body'>
//                 <h5 className='card-title'>{obj.name}</h5>
//                 <p className='card-text'>
//                   <a href={obj.Location} target="_blank" rel="noopener noreferrer">Location</a>
//                 </p>
//                 <p className='card-text'>Estimated Charges: {obj.Estimation_Cost}</p>
//                 <p className='card-text'>Address: {obj.Address}</p>
//                 <button className='btn btn-outline-primary' onClick={() => ViewPlace(obj)}>View Details</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showDetailedView && place && (
//         <div className='row justify-content-center'>
//           <div className='col-md-8 mb-4'>
//             <div className='card custom-card shadow-sm'>
//               <img src={place.image} className='card-img-top' alt='Destination' />
//               <div className='card-body'>
//                 <h5 className='card-title'>{place.name}</h5>
//                 <p className='card-text'>
//                   <a href={place.Location} target="_blank" rel="noopener noreferrer">Location</a>
//                 </p>
//                 <p className='card-text'>Estimated Charges: {place.Cost}</p>
//                 <p className='card-text'>Average Rating: {averageRating}</p>
//                 <div className='mb-3'>
//                   <h6 className='mb-0'>Rate</h6>
//                   <div>
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <span
//                         key={star}
//                         className={star <= rating ? "text-warning" : "text-secondary"}
//                         style={{ cursor: 'pointer' }}
//                         onClick={() => handleRatingChange(star)}
//                       >
//                         &#9733;
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 {images && images.length > 0 ? (
//         <div className='row justify-content-center'>
//           {images.map((image, index) => (
//             <div className='col-md-4 mb-4' key={index}>
//               <img src={image} alt={`Image ${index}`} className='img-fluid' />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No Review images.</p>
//       )}
//                 <div className='mb-3'>
//                   <h6 className='mb-0'>Upload Images</h6>
//                   <label className="btn btn-primary">
//                     <input type="file" multiple onChange={handleImageUpload} hidden />
//                     Add Images
//                   </label>
//                 </div>
//                 <button className="btn btn-primary" onClick={() => handleBookGuide(query)}>Book a Trip Guide</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && <GuideModal show={showModal} handleClose={closeModal} guiderData={guiderData} query={query} />}

//       <Outlet />
//     </div>
// </div>
//   );
// }

// export default UserProfile;

