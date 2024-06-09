import React, { useState, useEffect } from 'react';
import styles from './WelcomeDashboard.module.scss';
import { NavLink } from 'react-router-dom';
import image1 from '../../assets/smartsapce2.jpeg';
import image2 from '../../assets/smartsapce2.jpeg';
import image3 from '../../assets/smartsapce2.jpeg';

const images = [image1, image2, image3];

const WelcomeDashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <img src={images[currentImageIndex]} alt="Welcome to SmartByte" className={styles.animatedImage} />
      <div className={styles.buttonContainer}>
        <NavLink to="/login" className={`${styles.button} ${styles.signIn}`}>Sign In</NavLink>
        <NavLink to="/signup" className={`${styles.button} ${styles.signUp}`}>Sign Up</NavLink>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
