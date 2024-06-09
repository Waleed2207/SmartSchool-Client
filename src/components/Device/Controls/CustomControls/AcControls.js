import React from "react";
import { ModeControl } from "./ModeControl";
import { Temperature } from "./Temperature";


export const AcControls = ({ temperature, onChangeValue, acState ,device_room_idds, raspberryPiIP ,device_id}) => {
  console.log(device_id);
  return (
    <>
      <Temperature
        temperature={temperature}
        onChangeValue={onChangeValue}
        acState={acState}
      />
      <ModeControl acState={acState} device_room_idds={device_room_idds} raspberryPiIP={raspberryPiIP} device_id={device_id}/>
    </>
  );
};
