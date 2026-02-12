"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

const GOOGLE_MAPS_API_KEY = "AIzaSyBn6SrXt9nE7PboA-jFXug1zincSQlRdRs";

// GenTech coordinates (Brezovsko Shose 145, Plovdiv, Bulgaria)
const GENTECH_LOCATION = {
  lat: 42.1354,
  lng: 24.7453,
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

interface ContactInfoData {
  type: "contactInfo";
  studioInfo: {
    title: LocalizedContent<string>;
    description: LocalizedContent<string>;
    phone: string;
    address: LocalizedContent<string>;
  };
  openingHours: {
    title: LocalizedContent<string>;
    weekdays: {
      label: LocalizedContent<string>;
      hours: LocalizedContent<string>;
    };
    year: {
      label: LocalizedContent<string>;
      hours: LocalizedContent<string>;
    };
    holidays: {
      label: LocalizedContent<string>;
      answer: LocalizedContent<string>;
    };
  };
  mapEmbed?: string;
}

interface ContactInfoProps {
  data: ContactInfoData;
  locale: string;
}

export function ContactInfo({ data, locale }: ContactInfoProps) {
  const { studioInfo, openingHours } = data;

  return (
    <div className="space-y-8">
      {/* Studio Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-foreground mb-4">
          {getLocalizedContent(studioInfo.title, locale)}
        </h3>
        <p className="text-foreground/70 mb-6">
          {getLocalizedContent(studioInfo.description, locale)}
        </p>

        <div className="space-y-4">
          <a
            href={`tel:${studioInfo.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon icon="mdi:phone" className="w-5 h-5 text-primary" />
            </div>
            <span>{studioInfo.phone}</span>
          </a>

          <a
            href="https://maps.app.goo.gl/V3rvmEvFyFLjkH1d9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon icon="mdi:map-marker" className="w-5 h-5 text-primary" />
            </div>
            <span>{getLocalizedContent(studioInfo.address, locale)}</span>
          </a>
        </div>
      </motion.div>

      {/* Opening Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-foreground mb-4">
          {getLocalizedContent(openingHours.title, locale)}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">
              {getLocalizedContent(openingHours.weekdays.label, locale)}
            </span>
            <span className="text-primary font-semibold">
              {getLocalizedContent(openingHours.weekdays.hours, locale)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">
              {getLocalizedContent(openingHours.year.label, locale)}
            </span>
            <span className="text-primary font-semibold">
              {getLocalizedContent(openingHours.year.hours, locale)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">
              {getLocalizedContent(openingHours.holidays.label, locale)}
            </span>
            <span className="text-primary font-semibold">
              {getLocalizedContent(openingHours.holidays.answer, locale)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-2xl overflow-hidden h-64 md:h-80"
      >
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={GENTECH_LOCATION}
            defaultZoom={17}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            styles={DARK_MAP_STYLES}
            style={{ width: "100%", height: "100%" }}
          >
            <Marker position={GENTECH_LOCATION} title="Genesis Technology" />
          </Map>
        </APIProvider>
      </motion.div>
    </div>
  );
}
