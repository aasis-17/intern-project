import React from 'react'
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { useState } from 'react';

const Home = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div>
        <Button 
          children={"click me"}
          variant='secondary'
          size='lg'
          onClick={() => setIsModalVisible(true)}
          />

          <Modal
          visible ={isModalVisible}
          onClose={(e) => setIsModalVisible(false)} >
        <h2>Modal Title</h2>
        <p>This modal is rendered using React Portals!</p>
          </Modal>
    </div>
  )
}

export default Home
