// HouseMapLoading.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import styles from './Spinner.module.scss';

const HouseMapLoading = ({ isLoading }) => {
    return (
        <div className={`${styles["house-map-loading"]} ${isLoading ? styles["is-loading"] : ''}`}>
            <div className={styles["house-map-spinner"]}>
                <FontAwesomeIcon icon={faCircleNotch} spin size="3x" color="white" />
            </div>
        </div>
    );
};

export default HouseMapLoading;
