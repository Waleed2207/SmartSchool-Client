// import React from "react";
// import PropTypes from "prop-types";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import classes from "./Room.module.scss";
// function Room(props) {
//   return (
//     <div className={classes.Room}>
//       <div>
//         <div className={classes.Title}>{props.name}</div>
//         <div>
//           {props.devicesCount} {props.devicesCount === 1 ? "Device" : "Devices"}
//         </div>
    
//       </div>
      // {props.icon ? (
      //   <FontAwesomeIcon icon={props.icon} className={classes.Icon} />
      // ) : null}
//     </div>
//   );
// }

// Room.propTypes = {
//   id: PropTypes.string.isRequired,
//   name: PropTypes.string,
//   icon: PropTypes.object,
//   devicesCount: PropTypes.number,
//   userId: PropTypes.string.isRequired,
//   token: PropTypes.string.isRequired,
// };

// export default Room;










import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classes from "./Room.module.scss";
import { ROOMS_IDS, SERVER_URL } from "../../consts";
import { Notification } from "../Notification/Notification";
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
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { eventEmitter } from "../../WebSocket/ws.js";

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

const Room = ({ props,id, name, icon, devicesCount, spaceId }) => {
  const [motionDetected, setMotionDetected] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);
  const sensorsRef = useRef(sensors);

  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        console.log(`Fetching details for room ID: ${id}`);
        const roomResponse = await axios.get(`${SERVER_URL}/api-room/rooms/${id}`);
        const roomData = roomResponse.data;
        console.log("Room data:", roomData);
        setMotionDetected(roomData.motionDetected || false);

        const sensorsResponse = await axios.get(`${SERVER_URL}/api-sensors/sensors`, {
          params: { roomId: id },
        });
        const uniqueSensors = [...new Map(sensorsResponse.data.map(item => [item.sensor_id, item])).values()];
        setSensors(uniqueSensors);

        const devicesResponse = await axios.get(`${SERVER_URL}/api-device/room-devices/${id}`);
        setDevices(Array.isArray(devicesResponse.data) ? devicesResponse.data : []);
      } catch (err) {
        console.error("There was a problem fetching room, sensor or device data:", err.message);
      }
    };

    if (id) {
      getRoomDetails();
    } else {
      console.error("Room id is undefined or null");
    }
  }, [id]);

  useEffect(() => {
    const handleMotionDetected = (roomId) => {
      if (roomId === id) {
        setMotionDetected(true);
      }
    };

    const handleMotionCleared = (roomId) => {
      if (roomId === id) {
        setMotionDetected(false);
      }
    };

    eventEmitter.on("motionDetected", handleMotionDetected);
    eventEmitter.on("motionCleared", handleMotionCleared);

    return () => {
      eventEmitter.off("motionDetected", handleMotionDetected);
      eventEmitter.off("motionCleared", handleMotionCleared);
    };
  }, [id]);

  useEffect(() => {
    sensorsRef.current = sensors; // Update the ref after sensors state changes
  }, [sensors]);

  // Helper to get sensor activation status
  const getSensorActivationStatus = (sensorId) => {
    console.log("Searching for sensorId:", sensorId);  // Debug: log the sensorId being queried
   // console.log("Current sensors array:", JSON.stringify(sensors));  // Debug: log the full array
 
   const sensor = sensors.find(s => {
     const formattedDbId = s._id?.toString().trim();
     const formattedSensorId = s.sensor_id?.toString().trim();
     return formattedDbId === sensorId.trim() || formattedSensorId === sensorId.trim();
   });

   console.log("Found sensor:", sensor);  // Debug: log the found sensor object or undefined
   return sensor && sensor.activated === 'on' ? 'on' : 'off';
  };

  return (
    <div className={classes.Room}>
      <div>
        <div className={classes.Title}>{name}</div>
        <div className={classes.Devices}>
        {devices.map((device) => (
          <div key={device.device_id} className={classes.Device}>
            <FontAwesomeIcon
              icon={ICON_MAPPING[device.icon] || faQuestionCircle}
              color={device.state === "on" ? "green" : "red"}
              className={device.state === "on" ? classes.AnimatedIcon : ""}
            />
            <p>{device.device_name}</p>
          </div>
        ))}
      </div>
      <div className={classes.Sensors}>
      {sensors.map((sensors) => {
          const isActive = getSensorActivationStatus(sensors._id) === "on";
          const color = isActive ? "green" : "red";
          return (
            <div key={sensors._id} className={classes.Sensor}>
              <FontAwesomeIcon
                icon={SENSOR_ICON_MAPPING[sensors.name] || faQuestionCircle}
                color={color}
                className={isActive ? classes.AnimatedIcon : ""}
              />
              <p>{sensors.name}</p>
            </div>
          );
        })}
      </div>
      </div>
      
      
      {motionDetected && (
        <div className={classes.MotionIcon}>
          <FontAwesomeIcon icon={faUser} size="2x" color="red" className={classes.Flicker} />
        </div>
      )}
      <Notification
        showPersonIcon={() => setMotionDetected(true)}
        hidePersonIcon={() => setMotionDetected(false)}
      />
           {icon ? (
        <FontAwesomeIcon icon={icon} className={classes.Icon} />
      ) : null}
    </div>
  );
};

Room.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  icon: PropTypes.string,
  devicesCount: PropTypes.number,
  spaceId: PropTypes.string.isRequired,
};

export default Room;
