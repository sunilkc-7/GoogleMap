import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
const key = process.env.REACT_APP_GOOGLE_KEY;

function MapContainer(props) {
  const [selectedPlace, setSelectedPlace] = useState({});
  const [activeMarker, setActiveMarker] = useState({});
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onMapClicked = () => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  };

  const handleSearch = async (e) => {
    // const searchValue = e.target.value;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${key}`
    );
    const data = await response.json();
    setData(data.results[0]);

    setSelectedPlace({
      name: search,
      position: {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      },
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex" }}>
      <div
        style={{
          marginLeft: "10px",
          position: "absolute",
          top: "30%",
          left: "0",
          border: "1px solid red",
          zIndex: "99",
          padding: "30px 60px",
          background: "white",
          borderRadius: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <span>latitude:{data?.geometry?.location.lat}</span>
        <span>longitude:{data?.geometry?.location.lng}</span>
      </div>

      <span
        style={{
          // marginTop: "5px",
          // marginBottom: "5px",
          top: "80px",
          position: "relative",
          marginLeft: "10px",
          font: "10px",
          zIndex: "1",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter location"
        />
        <button onClick={handleSearch}>Search</button>
      </span>

      <Map
        google={props.google}
        onClick={onMapClicked}
        style={{ width: "100%", height: "100vh", position: "static" }}
        zoom={5}
        center={{
          lat: selectedPlace.position ? selectedPlace.position.lat : 27.717245,
          lng: selectedPlace.position ? selectedPlace.position.lng : 85.323959,
        }}
      >
        <Marker
          onClick={onMarkerClick}
          name={selectedPlace.name || "Kathmandu"}
          position={selectedPlace.position}
        />
        <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
          <div>
            <h1>{search}</h1>
            <p>
              Latitude:{""}
              {selectedPlace.position ? selectedPlace.position.lat : "N/A"}
            </p>
            <p>
              Longitude:{""}
              {selectedPlace.position ? selectedPlace.position.lng : "N/A"}
            </p>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: key,
})(MapContainer);
