import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuiderProfile.css';

const GuiderProfile = () => {
  const [guider, setGuider] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState(null);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [nonSelectedPlaces, setNonSelectedPlaces] = useState([]); // State for non-selected places
  const [check, setCheck] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuiderProfile = async () => {
      try {
        const guiderObj = localStorage.getItem("GuiderDetails");
        const parsedGuiderObj = JSON.parse(guiderObj);
        console.log("Guider Object from localStorage:", parsedGuiderObj);
        setGuider(parsedGuiderObj);
        setLoading(false);

        const resPlaces = await axios.get("http://localhost:3500/available-places");
        if (resPlaces.status === 200) {
          console.log("Available places data:", resPlaces.data.places);
          setAvailablePlaces(resPlaces.data.places);
        } else {
          console.error('No available places found or an error occurred.');
          setError('No available places found or an error occurred.');
        }

        console.log("Fetching guider's previous preferences");
        const resPreferredPlaces = await axios.post("http://localhost:3500/guider-previous-preferences", { guiderId: parsedGuiderObj._id });
        if (resPreferredPlaces.status === 200) {
          const preferredPlaces = resPreferredPlaces.data.preferredPlaces;
          console.log("Preferred places:", preferredPlaces);
          setSelectedPlaces(preferredPlaces);
        } else {
          throw new Error('Failed to fetch preferred places');
        }
        console.log("parsed guider object",parsedGuiderObj)
        const resData = await axios.post("http://localhost:3500/request-data", parsedGuiderObj);
        console.log(resData.data.payload)
        if (resData.status === 200) {
          setRequestData(resData.data.payload);
          console.log("requested data of users",requestData)
          console.log(resData.data)
        } else if (resData.status === 204) {
          setRequestData([]);
          setError("No users found for this guider.");
        }
      } catch (error) {
        console.error('Error fetching guider profile:', error);
        setError('Error fetching guider profile.');
      }
    };

    fetchGuiderProfile();
  }, [check]);

  const handlePlaceChange = (event) => {
    const place = event.target.value;
    setSelectedPlaces((prevSelectedPlaces) =>
      prevSelectedPlaces.includes(place)
        ? prevSelectedPlaces.filter((p) => p !== place)
        : [...prevSelectedPlaces, place]
    );
  };

  useEffect(() => {
    // Update non-selected places whenever selectedPlaces or availablePlaces change
    const nonSelected = availablePlaces.filter(place => !selectedPlaces.includes(place.place));
    setNonSelectedPlaces(nonSelected.map(place => place.place));
  }, [selectedPlaces, availablePlaces]);

  const handleAccept = async (obj) => {
    try {
      console.log("In accept request")
      console.log(obj)
      const userObj = obj;
      const guiderObj = JSON.parse(localStorage.getItem("GuiderDetails"));
      userObj.guider_id = guiderObj._id;
      console.log(userObj)
      const response = await axios.post("http://localhost:3500/accept-request", userObj);
      if (response.status === 200) {
        setRequestData(response.data.payload);
      }
      setCheck(true);
   
    console.log("calling back end request")
      } 
      catch (error) {
        console.error('Error updating request status:', error);
      }
  };

  const handleSubmitPreferences = async () => {
    try {
      console.log(nonSelectedPlaces)
      const guiderObj = JSON.parse(localStorage.getItem("GuiderDetails"));
      const response = await axios.put("http://localhost:3500/guider-saved-preferences", {
        guiderId: guiderObj._id,
        preferences: selectedPlaces,
      });
      if (response.status === 200) {
        alert("Preferences saved successfully!");
      }
      
      const responseRemove = await axios.delete("http://localhost:3500/remove-guider-from-places", {
        data: {
          guiderId: guiderObj._id,
          nonSelectedPlaces: nonSelectedPlaces,
        }
      });
      if (responseRemove.status === 200) {
        alert("Guider removed from non-selected places successfully!");
      }
      // get updated preferences  of bookingguiderscollection
       
      const responseUpdate= await axios.post("http://localhost:3500/update-BookingGuidersCollection");
      if (responseRemove.status === 200) {
        alert("BookingGuiders updated successfully!");
      }
    } catch (error) {
      console.error('Error submitting preferences:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container container mt-4">
    

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="places-container mb-4">
        <h3>Preferred Places</h3>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Select Preferred Places
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {availablePlaces.length > 0 ? (
              availablePlaces.map((place) => (
                <li key={place._id} className="dropdown-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={place.place}
                      onChange={handlePlaceChange}
                      checked={selectedPlaces.includes(place.place)}
                    />
                    <label className="form-check-label">
                      {place.place}
                    </label>
                  </div>
                </li>
              ))
            ) : (
              <li className="dropdown-item">No available places found.</li>
            )}
          </ul>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleSubmitPreferences}>Submit Preferences</button>
      </div>

      <div className="preferred-places mb-4">
        <h3>Selected Places</h3>
        <ul className="list-group">
          {selectedPlaces.map((place, index) => (
            <li key={index} className="list-group-item">
              {place}
            </li>
          ))}
        </ul>
      </div>

      {requestData?.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Place</th>
              <th>Status</th>
            </tr>
          </thead>
       
          <tbody>
            {requestData.map((reqObj) => (
           <tr key={reqObj.userObj._id}>
                 <td>{reqObj.userObj.name}</td>
                <td>{reqObj.userObj.Email}</td>
                <td>{reqObj.userObj.mobile || 'N/A'}</td> 
                <td>{reqObj.place}</td>
                <td>
            <button
                   className={`btn btn-${reqObj.status === 'Accepted' ? 'secondary' : 'primary'}`}
                    onClick={() => handleAccept(reqObj)}
                   disabled={reqObj.status === 'Accepted'}
              >
                  {reqObj.status === 'Accepted' ? 'Confirmed' : 'Accept'}
           </button>
            </td>
          </tr>
  ))}
</tbody>

        </table>
      ) : (
        !error && <div>No user requests found.</div>
      )}
    </div>
  );
};

export default GuiderProfile;
 
















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './GuiderProfile.css';

// const GuiderProfile = () => {
//   const [guider, setGuider] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [requestData, setRequestData] = useState(null);
//   const [availablePlaces, setAvailablePlaces] = useState([]);
//   const [selectedPlaces, setSelectedPlaces] = useState([]);
//   const [nonSelectedPlaces, setNonSelectedPlaces] = useState([]); // State for non-selected places
//   const [check, setCheck] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchGuiderProfile = async () => {
//       try {
//         const guiderObj = localStorage.getItem("GuiderDetails");
//         const parsedGuiderObj = JSON.parse(guiderObj);
//         console.log("Guider Object from localStorage:", parsedGuiderObj);
//         setGuider(parsedGuiderObj);
//         setLoading(false);

//         const resPlaces = await axios.get("http://localhost:3500/available-places");
//         if (resPlaces.status === 200) {
//           console.log("Available places data:", resPlaces.data.places);
//           setAvailablePlaces(resPlaces.data.places);
//         } else {
//           console.error('No available places found or an error occurred.');
//           setError('No available places found or an error occurred.');
//         }

//         console.log("Fetching guider's previous preferences");
//         const resPreferredPlaces = await axios.post("http://localhost:3500/guider-previous-preferences", { guiderId: parsedGuiderObj._id });
//         if (resPreferredPlaces.status === 200) {
//           const preferredPlaces = resPreferredPlaces.data.preferredPlaces;
//           console.log("Preferred places:", preferredPlaces);
//           setSelectedPlaces(preferredPlaces);
//         } else {
//           throw new Error('Failed to fetch preferred places');
//         }
//         console.log("parsed guider object",parsedGuiderObj)
//         const resData = await axios.post("http://localhost:3500/request-data", parsedGuiderObj);
//         console.log(resData.data.payload)
//         if (resData.status === 200) {
//           setRequestData(resData.data.payload);
//           console.log("requested data of users",requestData)
//           console.log(resData.data)
//         } else if (resData.status === 204) {
//           setRequestData([]);
//           setError("No users found for this guider.");
//         }
//       } catch (error) {
//         console.error('Error fetching guider profile:', error);
//         setError('Error fetching guider profile.');
//       }
//     };

//     fetchGuiderProfile();
//   }, [check]);

//   const handlePlaceChange = (event) => {
//     const place = event.target.value;
//     setSelectedPlaces((prevSelectedPlaces) =>
//       prevSelectedPlaces.includes(place)
//         ? prevSelectedPlaces.filter((p) => p !== place)
//         : [...prevSelectedPlaces, place]
//     );
//   };

//   useEffect(() => {
//     // Update non-selected places whenever selectedPlaces or availablePlaces change
//     const nonSelected = availablePlaces.filter(place => !selectedPlaces.includes(place.place));
//     setNonSelectedPlaces(nonSelected.map(place => place.place));
//   }, [selectedPlaces, availablePlaces]);

//   const handleAccept = async (obj) => {
//     try {
//       console.log("In accept request")
//       console.log(obj)
//       const userObj = obj;
//       const guiderObj = JSON.parse(localStorage.getItem("GuiderDetails"));
//       userObj.guider_id = guiderObj._id;
//       console.log(userObj)
//       const response = await axios.post("http://localhost:3500/accept-request", userObj);
//       if (response.status === 200) {
//         setRequestData(response.data.payload);
//       }
//       setCheck(true);
   
//     console.log("calling back end request")
//       } 
//       catch (error) {
//         console.error('Error updating request status:', error);
//       }
//   };

//   const handleSubmitPreferences = async () => {
//     try {
//       console.log(nonSelectedPlaces)
//       const guiderObj = JSON.parse(localStorage.getItem("GuiderDetails"));
//       const response = await axios.put("http://localhost:3500/guider-saved-preferences", {
//         guiderId: guiderObj._id,
//         preferences: selectedPlaces,
//       });
//       if (response.status === 200) {
//         alert("Preferences saved successfully!");
//       }
      
//       const responseRemove = await axios.delete("http://localhost:3500/remove-guider-from-places", {
//         data: {
//           guiderId: guiderObj._id,
//           nonSelectedPlaces: nonSelectedPlaces,
//         }
//       });
//       if (responseRemove.status === 200) {
//         alert("Guider removed from non-selected places successfully!");
//       }
//       // get updated preferences  of bookingguiderscollection
       
//       const responseUpdate= await axios.post("http://localhost:3500/update-BookingGuidersCollection");
//       if (responseRemove.status === 200) {
//         alert("BookingGuiders updated successfully!");
//       }
//     } catch (error) {
//       console.error('Error submitting preferences:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-container container mt-4">
    

//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className="places-container mb-4">
//         <h3>Preferred Places</h3>
//         <div className="dropdown">
//           <button
//             className="btn btn-secondary dropdown-toggle"
//             type="button"
//             id="dropdownMenuButton"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             Select Preferred Places
//           </button>
//           <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
//             {availablePlaces.length > 0 ? (
//               availablePlaces.map((place) => (
//                 <li key={place._id} className="dropdown-item">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       value={place.place}
//                       onChange={handlePlaceChange}
//                       checked={selectedPlaces.includes(place.place)}
//                     />
//                     <label className="form-check-label">
//                       {place.place}
//                     </label>
//                   </div>
//                 </li>
//               ))
//             ) : (
//               <li className="dropdown-item">No available places found.</li>
//             )}
//           </ul>
//         </div>
//         <button className="btn btn-primary mt-3" onClick={handleSubmitPreferences}>Submit Preferences</button>
//       </div>

//       <div className="preferred-places mb-4">
//         <h3>Selected Places</h3>
//         <ul className="list-group">
//           {selectedPlaces.map((place, index) => (
//             <li key={index} className="list-group-item">
//               {place}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {requestData?.length > 0 ? (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Place</th>
//               <th>Status</th>
//             </tr>
//           </thead>
       
//           <tbody>
//             {requestData.map((reqObj) => (
//            <tr key={reqObj.userObj._id}>
//                  <td>{reqObj.userObj.name}</td>
//                 <td>{reqObj.userObj.Email}</td>
//                 <td>{reqObj.place}</td>
//                 <td>
//             <button
//                    className={`btn btn-${reqObj.status === 'Accepted' ? 'secondary' : 'primary'}`}
//                     onClick={() => handleAccept(reqObj)}
//                    disabled={reqObj.status === 'Accepted'}
//               >
//                   {reqObj.status === 'Accepted' ? 'Confirmed' : 'Accept'}
//            </button>
//             </td>
//           </tr>
//   ))}
// </tbody>

//         </table>
//       ) : (
//         !error && <div>No user requests found.</div>
//       )}
//     </div>
//   );
// };

// export default GuiderProfile;
