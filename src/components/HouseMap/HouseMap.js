import React, { useEffect, useState } from "react";
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
  faHandshake
} from "@fortawesome/free-solid-svg-icons";
import {
  faWind,
  faFan,
  faTshirt,
  faTemperatureHigh,
  faLightbulb,
  faSeedling
} from "@fortawesome/free-solid-svg-icons";
import {
  faTint,
  faThermometerHalf,
  faRuler,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./HouseMap.module.scss";
import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "../Notification/Notification";
import { eventEmitter } from "../../WebSocket/ws.js";
import _ from "lodash";
import Spinner from '../Spinner/Spinner';
import HouseMapLoading from "../Spinner/HouseMapLoading";


const ICON_MAPPING = {
  AC: faWind,
  fan: faFan,
  laundry: faTshirt,
  heater: faTemperatureHigh,
  lights: faLightbulb,
  pump: faSeedling,
  default: faHandshake
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
  "bread-slice": <FontAwesomeIcon icon={faUtensils} size="1x" />,
  bed: <FontAwesomeIcon icon={faBed} size="1x" />,
  bath: <FontAwesomeIcon icon={faBath} size="1x" />, // map other icons...
  utensils: <FontAwesomeIcon icon={faConciergeBell} size="1x" />,
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
    return <Item device={device} />;
  });
};

const HouseMap = ({ onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [roomsWithDevices, setRoomsWithDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setMapReady] = useState(false);



  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/rooms`);
        const roomsWithMotion = response.data.map((room) => ({
          ...room,
          motionDetected: false,
        }));
        return roomsWithMotion;
      } catch (err) {
        console.log("There was a problem fetching room data:", err);
      }
    };

    const getSensors = async () => {
      const response = await axios.get(`${SERVER_URL}/sensors`);
      return response.data;
    };

    Promise.all([getRooms(), getSensors()])
      .then(([roomsData, sensorsData]) => {
        setRooms(roomsData);
        setSensors(sensorsData);
        setMapReady(true);  // Set isMapReady to true when data is loaded
        // delay setting isLoading to false by 500ms to give spinner time to fade out
        // setTimeout(() => setIsLoading(false), 500);
        // delay setting isLoading to false by 2 seconds to give map time to render
        setTimeout(() => setIsLoading(false), 2000);

      });
  }, []);


  useEffect(() => {
    const handleMotionDetected = (roomId) => {
      showPersonIcon(roomId);
    };

    eventEmitter.on("motionDetected", handleMotionDetected);

    return () => {
      eventEmitter.off("motionDetected", handleMotionDetected);
    };
  }, [rooms]);

  const showPersonIcon = (roomId) => {
    console.log(`Motion detected in room: ${roomId}`);
    setRooms((currentRooms) => {
      const newRooms = currentRooms.map((room) => {
        if (room._id === roomId) {
          return { ...room, motionDetected: true };
        } else {
          return { ...room, motionDetected: false };
        }
      });
      return newRooms;
    });
  };

  const hidePersonIcon = (roomId) => {
    setRooms((currentRooms) =>
      currentRooms.map((room) => {
        if (room.id === roomId) {
          return { ...room, motionDetected: false };
        }
        return room;
      })
    );
  };

  const getSensorActivationStatus = (sensorId) => {
    const sensor = sensors.find((s) => s._id === sensorId);
    if (sensor) {
      return sensor.activated;
    }
    return "off";
  };

  const handleMotionDetected = (roomId) => {
    console.log(`Event 'motionDetected' received with roomId: ${roomId}`);

    showPersonIcon(roomId);
  };
  // useEffect block to listen to 'motionDetected' events
  useEffect(() => {
    eventEmitter.on("motionDetected", handleMotionDetected);

    return () => {
      eventEmitter.off("motionDetected", handleMotionDetected);
    };
  }, [rooms]);


  useEffect(() => {
    const getRoomDevices = async (roomId) => {
      const devicesResponse = await axios.get(`${SERVER_URL}/devices`);
      const devices = devicesResponse.data;
      const devicesMap = devices.reduce((acc, device) => {
        acc[device.device_id] = device.name;
        return acc;
      }, {});
      const kitchenDevicesResponse = await axios.get(
        `${SERVER_URL}/room-devices/${ROOMS_IDS.KITCHEN}`
      );
      const livingRoomDevicesResponse = await axios.get(
        `${SERVER_URL}/room-devices/${ROOMS_IDS.LIVING_ROOM}`
      );
      const bathroomDevicesResponse = await axios.get(
        `${SERVER_URL}/room-devices/${ROOMS_IDS.BATHROOM}`
      );
      const diningRoomDevicesResponse = await axios.get(
        `${SERVER_URL}/room-devices/${ROOMS_IDS.DINING_ROOM}`
      );
      const bedroomDevicesResponse = await axios.get(
        `${SERVER_URL}/room-devices/${ROOMS_IDS.BEDROOM}`
      );

      const kitchenDevices = kitchenDevicesResponse.data.data;
      const livingRoomDevices = livingRoomDevicesResponse.data.data;
      const bathroomDevices = bathroomDevicesResponse.data.data;
      const diningRoomDevices = diningRoomDevicesResponse.data.data;
      const bedroomDevices = bedroomDevicesResponse.data.data;

      const roomDevicesMap = {
        [ROOMS_IDS.KITCHEN]: kitchenDevices,
        [ROOMS_IDS.LIVING_ROOM]: livingRoomDevices,
        [ROOMS_IDS.BATHROOM]: bathroomDevices,
        [ROOMS_IDS.DINING_ROOM]: diningRoomDevices,
        [ROOMS_IDS.BEDROOM]: bedroomDevices,
      };

      const roomsWithDevices = rooms.map((room) => {
        return { ...room, actualDevices: roomDevicesMap[room.id] };
      });

      setRoomsWithDevices(roomsWithDevices);
    };
    getRoomDevices();
  }, [rooms]);

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
                  <ItemsList devices={room.actualDevices} />
                </div>
                <div className={styles.sensors}>
                  {Object.entries(room.sensors).map(
                    ([sensorId, sensorName], index) => {
                      const isActive = getSensorActivationStatus(sensorId) === "on";
                      const color = isActive ? "green" : "red";
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "30px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={SENSOR_ICON_MAPPING[sensorName]}
                            color={color}
                            className={isActive ? styles.animatedIcon : ""}
                          />
                          <p style={{ marginRight: "10px", marginLeft: "10px" }}>
                            {sensorName}
                          </p>
                        </div>
                      );
                    }
                  )}
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

export default HouseMap;
