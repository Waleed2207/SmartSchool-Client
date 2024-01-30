import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './LocationDashboard.module.scss';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Add this line
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import { SERVER_URL } from '../../consts';



const LocationDashboard = ({user}) => {
    const [location, setLocation] = useState({ lat: null, lng: null, accuracy: null });
    const [distance, setDistance] = useState(0);


    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            position => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocation({ lat: latitude, lng: longitude, accuracy: accuracy });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const getDistance = async () => {
            try {
                if (location.lat != null && location.lng != null) {
                    const response = await axios.post(`${SERVER_URL}/location`, {
                        location,
                        user
                    });
                    setDistance(response.data.distance);
                }

            } catch (err) {
                console.log(err)
            }
        };
        getDistance();
    }, [location]);
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.headline}>Location</h1>
            <div className={styles.container}>
                <div className={styles['info-container']}>
                    <p className={styles["location-info"]}>Latitude: {location.lat}</p>
                    <p className={styles["location-info"]}>Longitude: {location.lng}</p>
                    <p className={styles["location-info"]}>Accuracy: {location.accuracy}</p>
                    <p className={styles["location-info"]}>Distance: {distance}</p>
                </div>
            </div>
            {location.lat && location.lng && (
                <div className={styles.map}>
                    <MapContainer
                        center={[location.lat, location.lng]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>
                                Current Location
                                <br />
                                Latitude: {location.lat}
                                <br />
                                Longitude: {location.lng}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default LocationDashboard;
