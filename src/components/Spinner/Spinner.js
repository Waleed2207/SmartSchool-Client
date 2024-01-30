import React from 'react';
import styles from './Spinner.module.scss';
import { BeatLoader } from 'react-spinners';

const Spinner = ({ isLoading }) => (
  <div className={`${styles.spinner} ${isLoading ? styles.show : styles.hide}`}>
    <BeatLoader color="#fff" />
  </div>
);

export default Spinner;
