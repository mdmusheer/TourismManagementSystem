import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import './Guidermodel.css';

const GuideModal = ({ show, handleClose, guiderData, query }) => {
  const [updatedGuiderData, setUpdatedGuiderData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const combinedData = {
        user: parsedUser,
        place: query,
        guider: guiderData.map(guider => ({ ...guider, status: "created" }))
      };

      axios.post('http://localhost:3500/Booking-Guiders', combinedData)
        .then(response => {
          console.log("Booking guiders response:", response.data);
        })
        .catch(error => {
          console.log('Error:', error);
        });
    }
  }, [guiderData, query]);

  useEffect(() => {
    if (guiderData && user) {
      axios.post('http://localhost:3500/get-booking-status', { user: user, place: query })
        .then(response => {
          const bookingStatus = response.data;
          const updatedData = guiderData.map(guider => {
            const status = bookingStatus.find(status => status.id === guider.id);
            return {
              ...guider,
              status: status ? status.status : "created"
            };
          });
          setUpdatedGuiderData(updatedData);
        })
        .catch(error => {
          console.log('Error fetching booking status:', error);
        });
    } else {
      setUpdatedGuiderData(guiderData);
    }
  }, [guiderData, user, query]);

  const handleBooking = (guider) => {
    const storedUser = localStorage.getItem('user');
    const Obj = {
      user: user,
      place: query,
      guider_obj: guider
    };

    axios.post("http://localhost:3500/confirm-booking", Obj)
      .then(response => {
        console.log("Confirm booking response:", response.data);
      })
      .catch(error => console.log(error));

    setUpdatedGuiderData(prevData =>
      prevData.map(g => g.id === guider.id ? { ...g, status: 'requested' } : g)
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg"  className="custom-modal">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>Guider Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {updatedGuiderData?.map((guider) => (
                <tr key={guider.id}>
                  <td>{guider.name}</td>
                  <td>{guider.Email}</td>
                  <td>
                    {guider.status === "created" ? (
                      <Button variant="primary" onClick={() => handleBooking(guider)}>Book</Button>
                    ) : guider.status === "requested" ? (
                      <Button variant="warning" disabled>Requested</Button>
                    ) : guider.status === "Accepted" ? (
                      <Button variant="success" disabled>Accepted</Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GuideModal;
