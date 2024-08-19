import React from 'react';
import './Home.css';
import { Carousel } from 'react-bootstrap';
import manali from '../images/manali.jpeg';
import ooty from '../images/ooty.webp';
import Kodaikanal from '../images/Kodaikanal.jpg';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate=useNavigate()
  const handleStartSearching=()=>{
    navigate("/user-profile")
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <p className='text-center top-text'>
            The world is full of incredible destinations waiting to be explored, from bustling cities steeped in history to breathtaking <span className='t1'>natural wonders.</span> Whether you crave adventure or relaxation, there's a trip perfectly suited to your interests. However, careful planning can make your journey smoother and more enjoyable. Research visa requirements, currency exchange rates, and local customs beforehand. Booking flights and accommodation in advance can ensure you get the best deals and avoid last-minute stress.
          </p>
        </div>
      </div>

      <div className='row main1'>
        <div className='col b1'></div>
        <div className='col'>
          <Carousel interval={2000}>
            <Carousel.Item>
              <img className='img-fluid rounded' src={manali} alt='Munnar' />
              <Carousel.Caption>
                <h3 className='text-center text-white'>Manali</h3>
                <p>Manali</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className='d-block p-20 img-fluid rounded' src={Kodaikanal} alt='Kodaikanal' />
              <Carousel.Caption>
                <h3 className='text-center text-white'>Kodaikanal</h3>
                <p>Kodaikanal</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className='d-block p-20 img-fluid rounded' src={ooty} alt='Ooty' />
              <Carousel.Caption>
                <h3 className='text-center text-white'>Ooty</h3>
                <p>Ooty</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className='col b2'></div>
      </div>
      {/* Start Searching Button */}
      <div className='text-center mt-4'>
        <button className='btn btn-primary' onClick={handleStartSearching}>
          Start Searching
        </button>
      </div>
     
      
    </div>
  );
}

export default Home;
