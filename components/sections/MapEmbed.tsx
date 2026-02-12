"use client";

import React from "react";
import { motion } from "framer-motion";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = "AIzaSyBn6SrXt9nE7PboA-jFXug1zincSQlRdRs";

// UBC Studio coordinates (Preslav 15, Plovdiv, Bulgaria)
const UBC_STUDIO_LOCATION = {
  lat: 42.14404752827351,
  lng: 24.744736131468695,
};

// Dark mode style for Google Maps
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

interface MapEmbedData {
  type: "mapEmbed";
  embedUrl?: string;
  height?: string;
}

interface MapEmbedProps {
  data: MapEmbedData;
  locale: string;
}

export function MapEmbed({ data }: MapEmbedProps) {
  const height = data.height || "400px";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full"
      style={{ height }}
    >
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={UBC_STUDIO_LOCATION}
          defaultZoom={17}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          styles={DARK_MAP_STYLES}
          style={{ width: "100%", height: "100%" }}
        >
          <Marker position={UBC_STUDIO_LOCATION} title="UBC Sound & Cinema Studio" />
        </Map>
      </APIProvider>
    </motion.section>
  );
}
