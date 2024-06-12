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
  faSeedling,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTint,
  faThermometerHalf,
  faQuestionCircle,
  faRuler,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./HouseMap.module.scss";
import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "../Notification/Notification";
import { eventEmitter } from "../../WebSocket/ws.js";
import _ from "lodash";
import HouseMapLoading from "../Spinner/HouseMapLoading";

const ICON_MAPPING = {
  AC: faSnowflake,
  home: faHome,
  fan: faFan,
  laundry: faTshirt,
  heater: faTemperatureHigh,
  lights: faLightbulb,
  pump: faSeedling,
  plug: faVideo, // Assuming faPlug is the icon for the plug
  Bulb: faLightbulb,
  switch: faToggleOn,
  default: faHandshake,
  computer: faDesktop,
  projector: faVideo,
  TV: faLaptop,
  ClassRoom: faChalkboardTeacher,
};

const SENSOR_ICON_MAPPING = {
  humidity: faTint,
  temperature: faThermometerHalf,
  distance: faRuler,
  moition: faBroadcastTower,
  soil: faSeedling,
};

Modal.setAppElement("#root");

const iconMapper = {
  couch: <FontAwesomeIcon icon={faCouch} size="1x" />,
  Home: <FontAwesomeIcon icon={faHome} size="1x" />,
  School: <FontAwesomeIcon icon={faSchool} size="1x" />,
  "bread-slice": <FontAwesomeIcon icon={faUtensils} size="1x" />,
  bed: <FontAwesomeIcon icon={faBed} size="1x" />,
  bath: <FontAwesomeIcon icon={faBath} size="1x" />,
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
  if (!devices || devices.length === 0) {
    return <p>No devices available</p>;
  }

  return devices.map((device) => {
    return <Item key={device.device_id} device={device} />;
  });
};

const HouseMap = ({ onClose, spaceId }) => {
  const [rooms, setRooms] = useState([]);
  const [roomsWithDevices, setRoomsWithDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setMapReady] = useState(false);
  const roomsRef = useRef(rooms);
  const [raspberryPiIP, setRaspberryPiIP] = useState("");
  const [sensorData, setSensorData] = useState({ temperature: null, humidity: null });

  const fetchRaspberryPiIP = async (spaceId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-space/spaces/${spaceId}`);
      if (response.data && response.data.data && response.data.data.rasp_ip) {
        const rasp_ip = response.data.data.rasp_ip;
        setRaspberryPiIP(rasp_ip);
        return rasp_ip; // Return the Raspberry Pi IP
      } else {
        console.error("Raspberry Pi IP not found in response:", response.data);
        setRaspberryPiIP(""); // Clear state if no IP found
        return null; // Return null if rasp_ip is not found
      }
    } catch (error) {
      console.error("Failed to fetch Raspberry Pi IP:", error);
      setRaspberryPiIP("");
      return null; // Return null and handle the error as appropriate
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchRaspberryPiIP(spaceId).then(rasp_ip => {
        if (rasp_ip) {
          getSensiboSensors(rasp_ip);
        }
      });
    }
  }, [spaceId]);

  const getSensiboSensors = async (rasp_pi) => {
    try {
      const url = `${SERVER_URL}/api-sensors/temperature?rasp_pi=${rasp_pi}`;

      const response = await axios.get(url);

      if (response.data) {
        const { temperature, humidity } = response.data;
        console.log(temperature, humidity);
        setSensorData({ temperature, humidity }); // Store sensor data in state
        return { temperature, humidity };
      } else {
        console.log("No measurements found.");
        return null; // Return null to indicate no data found
      }
    } catch (err) {
      console.error("Error fetching sensor data:", err.message);
      return null; // Return null to indicate failure
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      try {
        if (!spaceId) {
          console.error("No spaceId provided.");
          setIsLoading(false);
          return []; // Exit if no spaceId is provided and return an empty array
        }
        const response = await axios.get(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);
        console.log(response.data);
        const roomsWithMotion = response.data.map((room) => ({
          ...room,
          motionDetected: room.motionDetected !== undefined ? room.motionDetected : false,
        }));
        return roomsWithMotion;
      } catch (err) {
        console.error("There was a problem fetching room data:", err);
        return []; // Return an empty array in case of error
      }
    };

    const getSensors = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api-sensors/sensors`);
        return response.data;
      } catch (err) {
        console.error("There was a problem fetching sensor data:", err);
        return []; // Return an empty array in case of error
      }
    };

    Promise.all([getRooms(), getSensors()])
      .then(([roomsData, sensorsData]) => {
        if (roomsData && sensorsData) {
          setRooms(roomsData);
          setSensors(sensorsData);
          setMapReady(true);
          setTimeout(() => setIsLoading(false), 2000); // Use a timeout to delay setting isLoading to false
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setIsLoading(false); // Ensure loading state is disabled on error
        setMapReady(false); // Set map readiness to false on error
      });
  }, [spaceId]);

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
    const sensor = sensors.find((s) => {
      const formattedDbId = s._id?.toString().trim();
      const formattedSensorId = s.sensor_id?.toString().trim();
      return formattedDbId === sensorId.trim() || formattedSensorId === sensorId.trim();
    });

    return sensor && sensor.activated === "on" ? "on" : "off";
  };

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
    const getRoomDevices = async (spaceId) => {
      try {
        const urls = [
          `${SERVER_URL}/api-device/device/space/${spaceId}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.CLASS_ROOM_1}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.LIVING_ROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.BATHROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.DINING_ROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.BEDROOM}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.CLASS_ROOM_1}`,
          `${SERVER_URL}/api-device/room-devices/${ROOMS_IDS.CLASS_ROOM_2}`,
        ];

        const responses = await Promise.all(urls.map((url) => axios.get(url)));
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
          [ROOMS_IDS.CLASS_ROOM_2]: responses[7]?.data?.data || [],
        };

        const roomsWithDevices = rooms.map((room) => {
          return { ...room, actualDevices: roomDevicesMap[room.id] };
        });

        setRoomsWithDevices(roomsWithDevices);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };

    if (rooms.length > 0 && spaceId) {
      getRoomDevices(spaceId);
    }
  }, [rooms, spaceId]);

  return (
    <div className={styles["house-map-container"]}>
      <HouseMapLoading isLoading={isLoading} />
      {isMapReady && (
        <div className={styles["house-map"]}>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {roomsWithDevices.length > 0 ? (
            roomsWithDevices.map((room) => {
              return (
                <div
                  className={`${styles.room} ${styles[room.name.toLowerCase().replace(/\s/g, "-")]}`}
                  key={room.id}
                >
                  <div className={styles.roomHeader}>
                    <p
                      style={{
                        marginRight: "10px",
                        marginLeft: "10px",
                        fontSize: "20px",
                        color: "#006C88"
                      }}
                    >
                      {room.name}
                    </p>
                    {iconMapper[room.icon]}
                  </div>
                  <div className={styles.devices}>
                    <p style={{ fontFamily: "monospace", fontSize: "17px", fontWeight: "normal", color: "#006C88" }}>Actuators</p>
                    <ItemsList devices={room.actualDevices} spaceId={spaceId} />
                  </div>
                  <div className={styles.sensors}>
                    <p style={{ fontFamily: "monospace", fontSize: "17px", fontWeight: "normal", color: "#006C88" }}>Sensors</p>
                    {room.sensors && Object.entries(room.sensors).length > 0 ? (
                      Object.entries(room.sensors).map(([sensorId, sensorName], index) => {
                        const isActive = getSensorActivationStatus(sensorId) === "on";
                        const color = isActive ? "#006CFF" : "red";
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
                            <p style={{ marginRight: "10px", marginLeft: "10px", width: "90px" }}>
                              {sensorName}
                            </p>
                            {sensorName === "temperature" && (
                              <p style={{ marginRight: "10px", marginLeft: "10px", color: "grey" }}>
                                {sensorData.temperature}°
                              </p>
                            )}
                            {sensorName === "humidity" && (
                              <p style={{ marginRight: "10px", marginLeft: "10px", color: "grey" }}>
                                {sensorData.humidity}%
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p>No sensors available</p>
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
            })
          ) : (
            <p>No devices or sensors available</p>
          )}
          <Notification showPersonIcon={showPersonIcon} hidePersonIcon={hidePersonIcon} />
        </div>
      )}
    </div>
  );
};

export default HouseMap;
