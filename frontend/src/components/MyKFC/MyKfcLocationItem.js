import React, { useContext, useEffect, useState } from "react";
import {
  HomeOutlined,
  Delete,
  Edit,
  Apartment,
  BusinessCenterOutlined,
} from "@mui/icons-material";
import axios from "axios";
import locationContext from "../../context/locationContext";
import { useLocation } from "react-router-dom";
import RadioBtn from "../commons/RadioBtn";
import { useTranslation } from "react-i18next";

export default function MyKfcLocationItem({ location, index }) {
  const [address, setAddress] = useState("");
  const url = useLocation();

  const context = useContext(locationContext);
  const {
    setLongitude,
    setLatitude,
    setLocations,
    locations,
    setDisplaySections,
    setValue,
    setTagIndex,
    setLocationState,
    setLocationId,
    radioValue,
    setRadioValue,
  } = context;
  // handle when clicked on delete buttom
  const handleDelete = async (id) => {
    try {
      await axios
        .post(process.env.REACT_APP_BACKEND + "/api/location/delLocation/" + id)
        .then((res) => {
          if (res.data.error === false) {
            const newLocations = locations.filter((location) => {
              return location._id !== id;
            });
            setLocations(newLocations);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  // handle when clicked on edit button
  const handleEdit = async (id) => {
    setDisplaySections({ first: "flex", second: "none" });
    setValue(location.street);
    setTagIndex(parseInt(location.tag));
    // Set the state to update data in MyKFCAddLocaton Component Instead Of Adding Location, It will Edit Data. Location State is available in Accordin Component
    setLocationState("edit");
    setLocationId(id);
    setLongitude(location.lng);
    setLatitude(location.lat);
  };
  // get address of locations
  const getAddress = async (lat, lng) => {
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=` +
          process.env.REACT_APP_MAP_API_KEY
      )
      .then((res) => {
        setAddress(res.data.results[1].formatted_address);
      });
  };
  // handle when clicked on radio button
  const handleRadioClick = (index) => {
    setLongitude(location.lng);
    setLatitude(location.lat);
    setRadioValue({ value: location.street + "," + address, index: index });
  };

  const { t } = useTranslation();

  useEffect(() => {
    getAddress(location.lat, location.lng);
  }, [location.lat, location.lng]);
  return (
    <>
      {url.pathname === "/delivery" ? (
        <RadioBtn
          value={radioValue}
          index={index}
          handleClick={handleRadioClick}
        />
      ) : (
        <div className="address-icon">
          {location.tag === "0" ? <HomeOutlined /> : ""}
          {location.tag === "1" ? <BusinessCenterOutlined /> : ""}
          {location.tag === "2" ? <Apartment /> : ""}
        </div>
      )}
      <div className="address">
        <h3>{location.tag === "0" ? t("home") : ""}</h3>
        <h3>{location.tag === "1" ? t("office") : ""}</h3>
        <h3>{location.tag === "2" ? t("partner") : ""}</h3>
        <span style={{ fontFamily: "Poppins" }}>
          {location.street}, {address.length < 1 ? "Not Available" : address}
        </span>
      </div>
      {url.pathname === "/delivery" ? (
        ""
      ) : (
        <div className="edit-address">
          <div className="del-add" onClick={() => handleDelete(location._id)}>
            <Delete />
            {t("remove")}
          </div>
          <div className="edit-add" onClick={() => handleEdit(location._id)}>
            <Edit />
            {t("edit")}
          </div>
        </div>
      )}
    </>
  );
}
