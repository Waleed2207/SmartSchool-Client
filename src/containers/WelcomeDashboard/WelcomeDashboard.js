import React from 'react';
import styles from './WelcomeDashboard.module.scss';
import { NavLink } from 'react-router-dom';
import animation from '../../assets/smartByte_Intro.mp4';

const WelcomeDashboard = () => {
  return (
    <div className={styles.wrapper}>
      <video className={styles.animation} autoPlay muted loop>
        <source src={animation} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.buttonContainer}>
        <NavLink to="/login" className={`${styles.button} ${styles.signIn}`}>Sign In</NavLink>
        <NavLink to="/signup" className={`${styles.button} ${styles.signUp}`}>Sign Up</NavLink>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
