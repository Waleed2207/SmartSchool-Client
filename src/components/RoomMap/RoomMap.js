import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ROOMS_IDS, SERVER_URL } from "../../consts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCouch,
  faUtensils,
  faBed,
  faBath,
  faBroadcastTower,
  faConciergeBell,
  faHandshake,
  faDesktop,
  faVideo,
  faLaptop,
  faHome,
  faSchool,
  faChalkboardTeacher,
  
} from "@fortawesome/free-solid-svg-icons";
import {
  faFan,
  faTshirt,
  faSnowflake,
  faTemperatureHigh,
  faLightbulb,
  faSeedling, faToggleOn, 
} from "@fortawesome/free-solid-svg-icons";
import {
  faTint,
  faThermometerHalf,
  faQuestionCircle,
  faRuler,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./RoomMap.module.scss";
import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "../Notification/Notification";
import { eventEmitter } from "../../WebSocket/ws.js";
import _ from "lodash";
// import Spinner from '../Spinner/Spinner';
import HouseMapLoading from "../Spinner/HouseMapLoading";


const ICON_MAPPING = {
  AC: faSnowflake,
  home: faHome,
  fan: faFan,
  laundry: faTshirt,
  heater: faTemperatureHigh,
  lights: faLightbulb,
  pump: faSeedling,
  plug: faVideo,     
  Bulb:   faLightbulb,  // Assuming faPlug is the icon for the plug
  switch: faToggleOn,   // Assuming faToggleOn is the icon for the switch
  default: faHandshake,
  computer: faDesktop,
  projector: faVideo,
  TV:   faLaptop,
  ClassRoom: faChalkboardTeacher
};



// const SENSOR_ICON_MAPPING = {
//     couch: faCouch,
//     "bread-slice": faUtensils,
//     bed: faBed,
//     bath: faBath,
//     utensils: faConciergeBell
// }



const SENSOR_ICON_MAPPING = {
  humidity: faTint,
  temperature: faThermometerHalf,
  distance: faRuler,
  moition: faBroadcastTower,
  soil: faSeedling
};

Modal.setAppElement("#root");
const iconMapper = {
  couch: <FontAwesomeIcon icon={faCouch} size="1x" />,
  Home: <FontAwesomeIcon icon={faHome} size="1x" />,
  School: <FontAwesomeIcon icon={faSchool} size="1x" />,
  "bread-slice": <FontAwesomeIcon icon={faUtensils} size="1x" />,
  bed: <FontAwesomeIcon icon={faBed} size="1x" />,
  bath: <FontAwesomeIcon icon={faBath} size="1x" />, // map other icons...
  utensils: <FontAwesomeIcon icon={faConciergeBell} size="1x" />,
  ClassRoom: <FontAwesomeIcon icon={faChalkboardTeacher} size="1x" />,

};

const Item = ({ device }) => {
  const { device_name, state, icon } = device;
  const isDeviceActive = state === "on";
  return (
    <div style={{ display: "flex", alignItems: "center", height: "20px" }}>
      <FontAwesomeIcon
        icon={ICON_MAPPING[icon.name]}
        color={isDeviceActive ? icon.color : ""}
        className={isDeviceActive ? styles.animatedIcon : ""}
      />
      <p style={{ marginLeft: "10px" }}>{device_name}</p>
    </div>
  );
};

const ItemsList = ({ devices }) => {
  return devices.map((device) => {
    return <Item key={device.device_id} device={device} />;
  });
};

const RoomMap = ({ onClose, id, spaceId }) => {
  const [rooms, setRooms] = useState([]);
  const [roomsWithDevices, setRoomsWithDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setMapReady] = useState(false);
  const roomsRef = useRef(rooms);
    console.log("RoomMap" +id);


  useEffect(() => {
    const getRooms = async () => {
        try {
          if (!id) {
            console.error("No spaceId provided.");
            setIsLoading(false);
            return [];  // Exit if no spaceId is provided and return an empty array
          }
          const response = await axios.get(`${SERVER_URL}/api-room/rooms/${id}`);
          console.log("API Response Data:", response.data);
      
          // Check if response.data is an array
          let rooms = Array.isArray(response.data) ? response.data : [response.data]; // Wrap in array if it's a single object
          const roomsWithMotion = rooms.map(room => ({
            ...room,
            motionDetected: room.motionDetected !== undefined ? room.motionDetected : false,
          }));
          return roomsWithMotion;
        } catch (err) {
          console.error("There was a problem fetching room data:", err);
          return [];  // Return an empty array in case of error
        }
      };
      
  
    const getSensors = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api-sensors/sensors`);
        return response.data;
      } catch (err) {
        console.error("There was a problem fetching sensor data:", err);
        return [];  // Return an empty array in case of error
      }
      
    };
  
    Promise.all([getRooms(), getSensors()])
      .then(([roomsData, sensorsData]) => {
        if (roomsData && sensorsData) {  // Check if data is not null or undefined
          setRooms(roomsData);
          setSensors(sensorsData);
          setMapReady(true);
          setTimeout(() => setIsLoading(false), 2000);  // Use a timeout to delay setting isLoading to false
        }
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);  // Ensure loading state is disabled on error
        setMapReady(false);  // Set map readiness to false on error
      });
  
  }, [id]);  // Dependency array includes spaceId to re-run the effect when it changes
  


  // useEffect(() => {
  //   const handleMotionDetected = (roomId) => {
  //     showPersonIcon(roomId);
  //   };

  //   eventEmitter.on("motionDetected", handleMotionDetected);

  //   return () => {
  //     eventEmitter.off("motionDetected", handleMotionDetected);
  //   };
  // }, [rooms]);


    // Handles showing the person icon when motion is detected
    const showPersonIcon = (roomId) => {
      console.log(`Showing person icon in room: ${roomId}`);
      setRooms((currentRooms) => 
        currentRooms.map((room) => 
          room._id === roomId ? { ...room, motionDetected: true } : room
        )
      );
    };
  
    const hidePersonIcon = (roomId) => {
      console.log(`Hiding person icon in room: ${roomId}`);
      setRooms((currentRooms) => 
        currentRooms.map((room) => 
          room._id === roomId ? { ...room, motionDetected: false } : room
        )
      );
    };


    const getSensorActivationStatus = (sensorId) => {
      // console.log("Searching for sensorId:", sensorId);  // Debug: log the sensorId being queried
      // console.log("Current sensors array:", JSON.stringify(sensors));  // Debug: log the full array
    
      const sensor = sensors.find(s => {
        const formattedDbId = s._id?.toString().trim();
        const formattedSensorId = s.sensor_id?.toString().trim();
        return formattedDbId === sensorId.trim() || formattedSensorId === sensorId.trim();
      });
    
      console.log("Found sensor:", sensor);  // Debug: log the found sensor object or undefined
      return sensor && sensor.activated === 'on' ? 'on' : 'off';
    };
    
    

    //   // Example using React useEffect to ensure data is loaded
    // useEffect(() => {
    //   if (sensors.length > 0) {
    //     const activationStatus = getSensorActivationStatus(sensorId);
    //     console.log("Activation Status:", activationStatus);
    //   }
    // }, [sensors]);  // Depend on sensors to re-run when sensors change


// Simplified useEffect for motion events
    useEffect(() => {
      const handleMotionDetected = (roomId) => {
        console.log(`Motion detected in room: ${roomId}`);
        setRooms((currentRooms) => 
          currentRooms.map((room) => 
            room._id === roomId ? { ...room, motionDetected: true } : room
          )
        );
      };

      const handleMotionCleared = (roomId) => {
        console.log(`Motion cleared in room: ${roomId}`);
        setRooms((currentRooms) => 
          currentRooms.map((room) => 
            room._id === roomId ? { ...room, motionDetected: false } : room
          )
        );
      };

      eventEmitter.on("motionDetected", handleMotionDetected);
      eventEmitter.on("motionCleared", handleMotionCleared);

      return () => {
        eventEmitter.off("motionDetected", handleMotionDetected);
        eventEmitter.off("motionCleared", handleMotionCleared);
      };
    }, []);
    useEffect(() => {
      roomsRef.current = rooms; // Update the ref after rooms state changes
    }, [rooms]);
    
    useEffect(() => {
    const getRoomDevices = async (id) => {
      try {
        const urls = [
          `${SERVER_URL}/api-device/devices-by-room/${id}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.CLASS_ROOM_1}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.LIVING_ROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.BATHROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.DINING_ROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.BEDROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.CLASS_ROOM_1}`, 
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.CLASS_ROOM_2}`, 

        ];
    
        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const devices = Array.isArray(responses[0].data) ? responses[0].data : [];
        const devicesMap = devices.reduce((acc, device) => {
          acc[device.device_id] = device.name;
          return acc;
        }, {});
    
        const roomDevicesMap = {
          [ROOMS_IDS.KITCHEN]: responses[1]?.data?.data || [],
          [ROOMS_IDS.CLASS_ROOM_1]: responses[6]?.data?.data || [], // Correctly using index 6 for CLASS_ROOM
          [ROOMS_IDS.LIVING_ROOM]: responses[2]?.data?.data || [],
          [ROOMS_IDS.BATHROOM]: responses[3]?.data?.data || [],
          [ROOMS_IDS.DINING_ROOM]: responses[4]?.data?.data || [],
          [ROOMS_IDS.BEDROOM]: responses[5]?.data?.data || [],
          [ROOMS_IDS.CLASS_ROOM_2]: responses[7]?.data?.data || []

        };
    
        const roomsWithDevices = rooms.map((room) => {
          return { ...room, actualDevices: roomDevicesMap[room.id] };
        });
    
        setRoomsWithDevices(roomsWithDevices);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };

    if (rooms.length > 0 && id ) {
      getRoomDevices(id);
    }
  }, [rooms, id ]);

  return (
    <div className={styles["house-map-container"]}>
      <HouseMapLoading isLoading={isLoading} />
      {isMapReady && (
        <div className={styles["house-map"]}>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {roomsWithDevices.map((room) => {
            return (
              <div
                className={`${styles.room} ${styles[room.name.toLowerCase().replace(/\s/g, "-")]
                  }`}
                key={room.id}
              >
                <div className={styles.roomHeader}>
                  <p
                    style={{
                      marginRight: "10px",
                      marginLeft: "10px",
                      fontSize: "20px",
                    }}
                  >
                    {room.name}
                  </p>
                  {iconMapper[room.icon]}
                </div>
                <div className={styles.devices}>
                  <ItemsList devices={room.actualDevices} id={id} />
                </div>
                <div className={styles.sensors}>
                {Object.entries(room.sensors).map(([sensorId, sensorName], index) => {
                    const isActive = getSensorActivationStatus(sensorId) === "on";
                    const color = isActive ? "green" : "red";
                    
                    return (
                      <div
                        key={sensorId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "30px",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={SENSOR_ICON_MAPPING[sensorName] || faQuestionCircle}
                          color={color}
                          className={isActive ? styles.animatedIcon : ""}
                        />
                        <p style={{ marginRight: "10px", marginLeft: "10px" }}>
                          {sensorName}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {room.motionDetected && (
                  <div className={styles.motionIcon}>
                    <FontAwesomeIcon
                      icon={faUser}
                      size="2x"
                      color="red"
                      className={styles.flicker}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <Notification
            showPersonIcon={showPersonIcon}
            hidePersonIcon={hidePersonIcon}
          />
        </div>
      )}
    </div>
  );


};

export default RoomMap;
