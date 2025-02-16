'use client';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {
  Paper,
  Button,
  TextInput,
  Textarea,
  NumberInput,
  FileInput,
  Stack,
  Group,
  Text,
  Loader,
  List,
  Rating,
  Badge,
  Progress,
  Tabs,
} from '@mantine/core';
import {
  Camera,
  Clock,
  Heart,
  CheckCircle2,
  XCircle,
  Navigation2,
  CheckSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ExecutionMethod, Functions, ID, Storage } from 'appwrite';
import AppClient from './Apwr';

const WORLD_CENTER: [number, number] = [20, 0];
const ZOOM_LEVEL = 2;
const CHALLENGE_ZOOM_LEVEL = 15;

function MapController({
  center,
  zoom,
}: {
  center?: [number, number];
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [map, center, zoom]);

  return null;
}

const challenges = [
  {
    id: 1,
    title: 'DigiPen Challenge',
    location: [47.674, -122.1215] as [number, number],
    category: 'cultural',
    points: 500,
    description: 'Visit DigiPen Institute of Technology in Redmond.',
    difficulty: 'Easy',
    estimatedTime: '1 hour',
    task: 'Take a photo with the judges',
  },
  {
    id: 2,
    title: 'Eiffel Tower Adventure',
    location: [48.8584, 2.2945] as [number, number],
    category: 'cultural',
    points: 300,
    description:
      'Experience the iconic Eiffel Tower and its surrounding gardens.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a photo from the top observation deck',
  },
  {
    id: 3,
    title: 'Tokyo Street Food Safari',
    location: [35.6762, 139.6503] as [number, number],
    category: 'food',
    points: 250,
    description: 'Explore the vibrant street food scene in Tokyo.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Try authentic takoyaki in Shibuya',
  },
  {
    id: 4,
    title: 'Colosseum Time Travel',
    location: [41.8902, 12.4922] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Step back in time at the magnificent Roman Colosseum.',
    difficulty: 'Hard',
    estimatedTime: '4-5 hours',
    task: 'Document the different levels of the arena',
  },
  {
    id: 5,
    title: 'Sydney Harbor Challenge',
    location: [-33.8568, 151.2153] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Experience the best of Sydney Harbor.',
    difficulty: 'Expert',
    estimatedTime: '5-6 hours',
    task: 'Climb the Sydney Harbor Bridge',
  },
  {
    id: 6,
    title: 'Dubai Heights',
    location: [25.1972, 55.2744] as [number, number],
    category: 'adventure',
    points: 450,
    description: 'Explore the vertical wonders of Dubai.',
    difficulty: 'Expert',
    estimatedTime: '4-5 hours',
    task: 'Visit the Burj Khalifa observation deck',
  },
  {
    id: 7,
    title: 'Barcelona Gaudi Tour',
    location: [41.4036, 2.1744] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Discover the architectural wonders of Antoni Gaudi.',
    difficulty: 'Medium',
    estimatedTime: '6-7 hours',
    task: 'Visit Sagrada Familia',
  },
  {
    id: 8,
    title: 'Singapore Food Adventure',
    location: [1.3521, 103.8198] as [number, number],
    category: 'food',
    points: 200,
    description: 'Experience the diverse flavors of Singapore.',
    difficulty: 'Easy',
    estimatedTime: '4-5 hours',
    task: 'Try Hainanese chicken rice at a hawker center',
  },
  {
    id: 9,
    title: 'New York City Landmarks',
    location: [40.7128, -74.006] as [number, number],
    category: 'adventure',
    points: 350,
    description: 'Explore the iconic landmarks of NYC.',
    difficulty: 'Hard',
    estimatedTime: '8-9 hours',
    task: 'Walk across the Brooklyn Bridge at sunset',
  },
  {
    id: 10,
    title: 'Louvre Museum Hunt',
    location: [48.8606, 2.3376] as [number, number],
    category: 'cultural',
    points: 400,
    description: 'Discover treasures within the world-famous Louvre Museum.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Find and photograph the Mona Lisa',
  },
  {
    id: 11,
    title: 'Mont Saint-Michel Exploration',
    location: [48.6361, -1.5115] as [number, number],
    category: 'adventure',
    points: 450,
    description: 'Visit the historic island commune of Mont Saint-Michel.',
    difficulty: 'Expert',
    estimatedTime: '6-7 hours',
    task: 'Climb to the abbey at high tide',
  },
  {
    id: 12,
    title: 'Kyoto Temple Trek',
    location: [35.0116, 135.7681] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Explore the ancient temples of Kyoto.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Complete the Fushimi Inari Shrine hike',
  },
  {
    id: 13,
    title: 'Mount Fuji Adventure',
    location: [35.3606, 138.7274] as [number, number],
    category: 'adventure',
    points: 450,
    description: 'Conquer the majestic Mount Fuji.',
    difficulty: 'Expert',
    estimatedTime: '7-8 hours',
    task: 'Watch the sunrise from the summit',
  },
  {
    id: 14,
    title: 'Osaka Food Crawl',
    location: [34.6937, 135.5023] as [number, number],
    category: 'food',
    points: 250,
    description: 'Taste the best street food in Osaka.',
    difficulty: 'Easy',
    estimatedTime: '3-4 hours',
    task: 'Try okonomiyaki in Dotonbori',
  },
  {
    id: 15,
    title: 'Hiroshima Peace Tour',
    location: [34.3853, 132.4553] as [number, number],
    category: 'historical',
    points: 350,
    description: 'Visit Hiroshima and learn about its history.',
    difficulty: 'Medium',
    estimatedTime: '4-5 hours',
    task: 'Tour the Hiroshima Peace Memorial Museum',
  },

  {
    id: 16,
    title: 'Pike Place Market Experience',
    location: [47.6097, -122.3425] as [number, number],
    category: 'food',
    points: 200,
    description: 'Visit the iconic Pike Place Market in Seattle.',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    task: 'Catch a fish thrown by a fishmonger',
  },
  {
    id: 17,
    title: 'Space Needle Skyline Challenge',
    location: [47.6205, -122.3493] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Experience the breathtaking view from the Space Needle.',
    difficulty: 'Medium',
    estimatedTime: '1-2 hours',
    task: 'Take a photo of the Seattle skyline from the observation deck',
  },
  {
    id: 18,
    title: 'Mount Rainier Hiking Adventure',
    location: [46.8523, -121.7603] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Hike the trails of Mount Rainier National Park.',
    difficulty: 'Hard',
    estimatedTime: '5-6 hours',
    task: 'Reach Panorama Point and capture the view',
  },
  {
    id: 19,
    title: 'Olympic National Park Exploration',
    location: [47.8021, -123.6044] as [number, number],
    category: 'adventure',
    points: 450,
    description: 'Discover the diverse ecosystems of Olympic National Park.',
    difficulty: 'Expert',
    estimatedTime: '6-7 hours',
    task: 'Hike through the Hoh Rainforest and photograph a waterfall',
  },
  {
    id: 20,
    title: 'Chihuly Garden and Glass Tour',
    location: [47.6206, -122.3505] as [number, number],
    category: 'cultural',
    points: 250,
    description: 'Admire stunning glass artwork at Chihuly Garden and Glass.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Take a photo of your favorite glass sculpture',
  },
  {
    id: 21,
    title: 'San Juan Islands Wildlife Safari',
    location: [48.5305, -123.0895] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Explore the scenic San Juan Islands and spot wildlife.',
    difficulty: 'Medium',
    estimatedTime: '4-5 hours',
    task: 'Spot an orca whale during a boat tour',
  },
  {
    id: 22,
    title: 'Leavenworth Bavarian Village',
    location: [47.5962, -120.6615] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Visit the charming Bavarian-themed village of Leavenworth.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Try authentic bratwurst at a local restaurant',
  },
  {
    id: 23,
    title: 'Woodinville Wine Tasting Tour',
    location: [47.7543, -122.1635] as [number, number],
    category: 'food',
    points: 200,
    description: 'Savor the best wines in Washington’s wine country.',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    task: 'Taste three different wines at a local winery',
  },
  {
    id: 24,
    title: 'Boeing Future of Flight Experience',
    location: [47.9231, -122.2717] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Tour the Boeing factory and learn about aviation innovation.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Take a photo with a Dreamliner on display',
  },
  {
    id: 25,
    title: 'North Cascades Scenic Drive',
    location: [48.7718, -121.2985] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Drive through the stunning North Cascades Highway.',
    difficulty: 'Medium',
    estimatedTime: '5-6 hours',
    task: 'Photograph the view from Diablo Lake Overlook',
  },
  {
    id: 26,
    title: 'Golden Gate Bridge Stroll',
    location: [37.8199, -122.4783] as [number, number],
    category: 'adventure',
    points: 250,
    description: 'Walk across the Golden Gate Bridge in San Francisco.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Take a photo of the bridge at sunset',
  },

  // Italy
  {
    id: 27,
    title: 'Vatican City Exploration',
    location: [41.9029, 12.4534] as [number, number],
    category: 'cultural',
    points: 400,
    description: 'Visit St. Peter’s Basilica and the Vatican Museums.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Find and photograph the Sistine Chapel ceiling',
  },

  // United Kingdom
  {
    id: 28,
    title: 'Stonehenge Mystery Tour',
    location: [51.1789, -1.8262] as [number, number],
    category: 'historical',
    points: 300,
    description: 'Explore the ancient site of Stonehenge.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Take a panoramic photo of the stone circle',
  },
  {
    id: 29,
    title: 'London Eye Challenge',
    location: [51.5033, -0.1196] as [number, number],
    category: 'cultural',
    points: 250,
    description: 'Ride the London Eye and enjoy the city view.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Photograph the Houses of Parliament from the top',
  },

  // India
  {
    id: 30,
    title: 'Taj Mahal Sunrise Tour',
    location: [27.1751, 78.0421] as [number, number],
    category: 'cultural',
    points: 400,
    description: 'Visit the Taj Mahal at sunrise.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a reflection photo of the Taj in the pond',
  },

  // Brazil
  {
    id: 31,
    title: 'Christ the Redeemer Pilgrimage',
    location: [-22.9519, -43.2105] as [number, number],
    category: 'cultural',
    points: 400,
    description: 'Visit the iconic Christ the Redeemer statue in Rio.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a selfie with the statue in the background',
  },

  // China
  {
    id: 32,
    title: 'Great Wall Hike',
    location: [40.4319, 116.5704] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Climb a section of the Great Wall of China.',
    difficulty: 'Hard',
    estimatedTime: '4-5 hours',
    task: 'Take a wide-angle photo of the wall stretching into the distance',
  },

  // Australia
  {
    id: 33,
    title: 'Sydney Opera House Tour',
    location: [-33.8568, 151.2153] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Tour the famous Sydney Opera House.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Photograph the Opera House from across the harbor',
  },

  // Japan
  {
    id: 34,
    title: 'Tokyo Skytree Adventure',
    location: [35.71, 139.8107] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Visit the tallest tower in Japan, the Tokyo Skytree.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Capture the cityscape from the observation deck',
  },

  // South Africa
  {
    id: 35,
    title: 'Cape of Good Hope Trek',
    location: [-34.3568, 18.474] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Hike to the Cape of Good Hope for stunning views.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Take a photo at the Cape of Good Hope sign',
  },

  // Egypt
  {
    id: 36,
    title: 'Pyramids of Giza Adventure',
    location: [29.9792, 31.1342] as [number, number],
    category: 'historical',
    points: 500,
    description: 'Visit the Great Pyramids of Giza and the Sphinx.',
    difficulty: 'Hard',
    estimatedTime: '4-5 hours',
    task: 'Photograph yourself in front of the Great Pyramid',
  },

  // Canada
  {
    id: 37,
    title: 'Niagara Falls Excursion',
    location: [43.0962, -79.0377] as [number, number],
    category: 'adventure',
    points: 350,
    description: 'Experience the thundering Niagara Falls.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a photo from the base of the falls',
  },

  // Russia
  {
    id: 38,
    title: 'Red Square Exploration',
    location: [55.7539, 37.6208] as [number, number],
    category: 'historical',
    points: 300,
    description: 'Visit the iconic Red Square in Moscow.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Photograph St. Basil’s Cathedral',
  },

  // Mexico
  {
    id: 39,
    title: 'Chichen Itza Discovery',
    location: [20.6843, -88.5678] as [number, number],
    category: 'historical',
    points: 400,
    description: 'Explore the Mayan ruins of Chichen Itza.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Capture a photo of El Castillo',
  },

  // Germany
  {
    id: 40,
    title: 'Neuschwanstein Castle Tour',
    location: [47.5576, 10.7498] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Visit the fairy tale Neuschwanstein Castle.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Photograph the castle from Marienbrücke bridge',
  },

  // Thailand
  {
    id: 41,
    title: 'Wat Arun Visit',
    location: [13.7437, 100.4889] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Explore the stunning Temple of Dawn in Bangkok.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Photograph the temple during sunset',
  },

  // Spain
  {
    id: 42,
    title: 'Alhambra Palace Tour',
    location: [37.1761, -3.5881] as [number, number],
    category: 'historical',
    points: 400,
    description: 'Explore the Alhambra in Granada.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the Court of the Lions',
  },

  // Turkey
  {
    id: 43,
    title: 'Hot Air Balloon Ride in Cappadocia',
    location: [38.6422, 34.8272] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Soar above the magical landscape of Cappadocia.',
    difficulty: 'Expert',
    estimatedTime: '4-5 hours',
    task: 'Photograph the view from the hot air balloon',
  },
  {
    id: 44,
    title: 'Palace of Versailles Tour',
    location: [48.8049, 2.1204] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Explore the grandeur of the Palace of Versailles.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the Hall of Mirrors',
  },

  // South Korea
  {
    id: 45,
    title: 'Gyeongbokgung Palace Visit',
    location: [37.5796, 126.977] as [number, number],
    category: 'historical',
    points: 300,
    description: 'Discover the royal palace of Gyeongbokgung in Seoul.',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    task: 'Photograph the changing of the guard ceremony',
  },

  // Argentina
  {
    id: 46,
    title: 'Iguazu Falls Adventure',
    location: [-25.6953, -54.4367] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Experience the breathtaking Iguazu Falls.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Take a photo of the Devil’s Throat section',
  },

  // Greece
  {
    id: 47,
    title: 'Acropolis of Athens Tour',
    location: [37.9715, 23.7267] as [number, number],
    category: 'historical',
    points: 350,
    description: 'Explore the ancient ruins of the Acropolis.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Photograph the Parthenon',
  },

  // Peru
  {
    id: 48,
    title: 'Machu Picchu Trek',
    location: [-13.1631, -72.545] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Hike to the ancient Incan citadel of Machu Picchu.',
    difficulty: 'Hard',
    estimatedTime: '6-8 hours',
    task: 'Photograph the site from the Sun Gate',
  },

  // Iceland
  {
    id: 49,
    title: 'Blue Lagoon Relaxation',
    location: [63.8804, -22.4495] as [number, number],
    category: 'adventure',
    points: 250,
    description: 'Unwind at the famous geothermal Blue Lagoon.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Take a photo soaking in the hot springs',
  },

  // Kenya
  {
    id: 50,
    title: 'Safari at Maasai Mara',
    location: [-1.4061, 35.048] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Go on a safari to spot the Big Five.',
    difficulty: 'Hard',
    estimatedTime: '4-6 hours',
    task: 'Photograph lions in the wild',
  },

  // United States (additional landmarks)
  {
    id: 51,
    title: 'Grand Canyon Rim Hike',
    location: [36.0544, -112.1401] as [number, number],
    category: 'adventure',
    points: 450,
    description: 'Hike along the rim of the Grand Canyon.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Take a panoramic photo of the canyon',
  },
  {
    id: 52,
    title: 'Times Square Lights Challenge',
    location: [40.758, -73.9855] as [number, number],
    category: 'cultural',
    points: 200,
    description: 'Experience the vibrant energy of Times Square.',
    difficulty: 'Easy',
    estimatedTime: '1 hour',
    task: 'Take a selfie with the neon lights',
  },

  // Norway
  {
    id: 53,
    title: 'Northern Lights Chase',
    location: [69.6496, 18.956] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Witness the Aurora Borealis in Tromsø.',
    difficulty: 'Hard',
    estimatedTime: '5-6 hours',
    task: 'Capture the Northern Lights in the sky',
  },

  // UAE (additional landmark)
  {
    id: 54,
    title: 'Sheikh Zayed Grand Mosque Tour',
    location: [24.4129, 54.4761] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Visit the stunning Sheikh Zayed Grand Mosque in Abu Dhabi.',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    task: 'Photograph the intricate architecture of the mosque',
  },

  // Morocco
  {
    id: 55,
    title: 'Sahara Desert Camel Ride',
    location: [31.5095, -4.2166] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Ride a camel through the golden dunes of the Sahara Desert.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a photo during the desert sunset',
  },

  // Switzerland
  {
    id: 56,
    title: 'Matterhorn Hike',
    location: [45.9763, 7.6586] as [number, number],
    category: 'adventure',
    points: 500,
    description: 'Trek near the iconic Matterhorn mountain.',
    difficulty: 'Hard',
    estimatedTime: '4-5 hours',
    task: 'Photograph the mountain from Zermatt',
  },

  // Portugal
  {
    id: 57,
    title: 'Sintra Palace Exploration',
    location: [38.7875, -9.3908] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Visit the colorful Pena Palace in Sintra.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a photo of the palace from the gardens',
  },

  // Indonesia
  {
    id: 58,
    title: 'Borobudur Temple Visit',
    location: [-7.6079, 110.2038] as [number, number],
    category: 'cultural',
    points: 400,
    description: 'Explore the ancient Borobudur Temple.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the sunrise from the top of the temple',
  },

  // Additional iconic landmarks
  {
    id: 59,
    title: 'Petra Exploration',
    location: [30.3285, 35.4444] as [number, number],
    category: 'historical',
    points: 450,
    description: 'Visit the ancient city of Petra in Jordan.',
    difficulty: 'Hard',
    estimatedTime: '4-5 hours',
    task: 'Photograph the Treasury from the Siq',
  },
  {
    id: 60,
    title: 'Angkor Wat Sunrise Tour',
    location: [13.4125, 103.8667] as [number, number],
    category: 'historical',
    points: 400,
    description: 'Visit the largest religious monument in Cambodia.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Capture the sunrise over Angkor Wat',
  },
  {
    id: 61,
    title: 'Statue of Liberty Visit',
    location: [40.6892, -74.0445] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Tour the Statue of Liberty on Liberty Island.',
    difficulty: 'Easy',
    estimatedTime: '2 hours',
    task: 'Photograph the statue with Manhattan in the background',
  },
  {
    id: 62,
    title: 'Pyramids of Giza Exploration',
    location: [29.9773, 31.1325] as [number, number],
    category: 'historical',
    points: 450,
    description: 'Marvel at the ancient Pyramids of Giza.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the Sphinx with the Great Pyramid',
  },

  // Brazil
  {
    id: 63,
    title: 'Christ the Redeemer Visit',
    location: [-22.9519, -43.2105] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Visit the iconic Christ the Redeemer statue in Rio.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a selfie with the statue in the background',
  },

  // Russia
  {
    id: 64,
    title: 'Red Square Adventure',
    location: [55.7539, 37.6208] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Walk through Moscow’s historic Red Square.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Photograph St. Basil’s Cathedral',
  },

  // South Africa
  {
    id: 65,
    title: 'Table Mountain Hike',
    location: [-33.9628, 18.4098] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Climb the iconic Table Mountain in Cape Town.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Take a panoramic photo of Cape Town from the summit',
  },

  // China
  {
    id: 66,
    title: 'Great Wall Trek',
    location: [40.4319, 116.5704] as [number, number],
    category: 'historical',
    points: 450,
    description: 'Hike along the Great Wall of China.',
    difficulty: 'Hard',
    estimatedTime: '5-6 hours',
    task: 'Photograph the wall stretching into the horizon',
  },

  // Australia (additional landmark)
  {
    id: 67,
    title: 'Uluru Exploration',
    location: [-25.3444, 131.0369] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Visit the sacred red monolith of Uluru.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the sunset over Uluru',
  },

  // Thailand
  {
    id: 68,
    title: 'Grand Palace Tour',
    location: [13.75, 100.4913] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Explore the majestic Grand Palace in Bangkok.',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    task: 'Photograph the Emerald Buddha Temple',
  },

  // Mexico
  {
    id: 69,
    title: 'Chichen Itza Visit',
    location: [20.6843, -88.5678] as [number, number],
    category: 'historical',
    points: 400,
    description: 'Explore the ancient Mayan city of Chichen Itza.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the El Castillo pyramid',
  },

  // Canada
  {
    id: 70,
    title: 'Niagara Falls Adventure',
    location: [43.0896, -79.0849] as [number, number],
    category: 'adventure',
    points: 300,
    description: 'Experience the power of Niagara Falls.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Take a photo from the Hornblower Cruise',
  },

  // Italy (additional landmark)
  {
    id: 71,
    title: 'Leaning Tower of Pisa',
    location: [43.7228, 10.3966] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Visit the iconic Leaning Tower of Pisa.',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    task: 'Take a creative photo pretending to hold up the tower',
  },

  // Japan (additional landmark)
  {
    id: 72,
    title: 'Osaka Castle Visit',
    location: [34.6873, 135.5259] as [number, number],
    category: 'historical',
    points: 250,
    description: 'Discover the history of Osaka Castle.',
    difficulty: 'Easy',
    estimatedTime: '2 hours',
    task: 'Photograph the castle during cherry blossom season',
  },

  // New Zealand
  {
    id: 73,
    title: 'Milford Sound Cruise',
    location: [-44.6704, 167.9279] as [number, number],
    category: 'adventure',
    points: 350,
    description: 'Cruise through the stunning Milford Sound.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a photo of the towering waterfalls',
  },

  // Turkey
  {
    id: 74,
    title: 'Hot Air Balloon in Cappadocia',
    location: [38.6455, 34.8273] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Soar above Cappadocia in a hot air balloon.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the fairy chimneys from the air',
  },

  // Germany
  {
    id: 75,
    title: 'Neuschwanstein Castle Visit',
    location: [47.5576, 10.7498] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Tour the picturesque Neuschwanstein Castle.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Photograph the castle from Marienbrücke',
  },

  // Spain (additional landmark)
  {
    id: 76,
    title: 'Alhambra Palace Tour',
    location: [37.176, -3.5881] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Visit the stunning Alhambra Palace in Granada.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    task: 'Photograph the intricate tilework of the palace',
  },

  // Austria
  {
    id: 77,
    title: 'Hallstatt Village Exploration',
    location: [47.5615, 13.6493] as [number, number],
    category: 'cultural',
    points: 250,
    description: 'Explore the charming lakeside village of Hallstatt.',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    task: 'Photograph the village reflected in the lake',
  },

  // Ireland
  {
    id: 78,
    title: 'Cliffs of Moher Hike',
    location: [52.9715, -9.4263] as [number, number],
    category: 'adventure',
    points: 350,
    description: 'Walk along the dramatic Cliffs of Moher.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    task: 'Take a photo of the cliffs at sunset',
  },

  // Vietnam
  {
    id: 79,
    title: 'Halong Bay Cruise',
    location: [20.9101, 107.1839] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Sail through the emerald waters of Halong Bay.',
    difficulty: 'Medium',
    estimatedTime: '4-5 hours',
    task: 'Photograph the limestone karsts and caves',
  },
];

interface MapProps {
  onChallengeClick?: () => void;
}

const categoryColors = {
  adventure: '#DC2626',
  cultural: '#7C3AED',
  food: '#059669',
  nature: '#2563EB',
  historical: '#D97706',
};

export default function Map({ onChallengeClick }: MapProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<
    (typeof challenges)[0] | null
  >(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<
    'pending' | 'loading' | 'accepted' | 'rejected'
  >('pending');
  const [mapCenter, setMapCenter] = useState<[number, number]>(WORLD_CENTER);
  const [mapZoom, setMapZoom] = useState(ZOOM_LEVEL);
  const [mapKey] = useState(() => Math.random());
<<<<<<< HEAD
  let imagefile: File;
  

  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const resetTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleChallengeClick = (challenge: (typeof challenges)[0]) => {
    setSelectedChallenge(challenge);
    setMapCenter(challenge.location);
    setMapZoom(CHALLENGE_ZOOM_LEVEL);
  };


  async function getFileUrl(file: File) {
    if (!file) {
      throw new Error('No file provided.');
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default"); // Unsigned preset for uploads
  
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dzdlqeted/image/upload`;
  
    try {
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new Error('Failed to upload file to Cloudinary.');
    }
  }


  function createEncodedURL(baseUrl:string, params:object) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  
    return `${baseUrl}?${queryString}`;
  }

  const handleSubmit = async (task:string) => {
    setCompletionStatus('loading');

    const params = {
      reqs: task,
      url: await getFileUrl(imagefile),
    }

    const functions = new Functions(AppClient);
    try {
      const result = await functions.createExecution(
      '67b14a61003985a90a52',
      '', 
      false, 
      createEncodedURL('https://67b14a62e437dba49a1f.appwrite.global', params),
      ExecutionMethod.GET,
      );

      const responseBody = JSON.parse(result.responseBody);
      if (responseBody.taskCompleted === true) {
      setCompletionStatus('accepted');
      } else {
      setCompletionStatus('rejected');
      }
    } catch (error) {
      console.error('Error executing function:', error);
      setCompletionStatus('rejected');
    }
    
  };

=======
>>>>>>> origin/main
  const renderCompletionStatus = () => {
    if (completionStatus === 'loading') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader size="lg" color="blue" />
            <div>
              <Text size="lg" fw={600} className="text-blue-600 mb-2">
                Verifying Challenge...
              </Text>
              <Text size="sm" c="dimmed">
                Please wait while we review your submission
              </Text>
            </div>
          </div>
        </motion.div>
      );
    }
    if (completionStatus === 'accepted') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center"
        >
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <Text size="lg" fw={600} className="text-green-600">
            Challenge Completed!
          </Text>
          <Text size="sm" c="dimmed" mt={2}>
            Points have been added to your profile
          </Text>
        </motion.div>
      );
    }
    if (completionStatus === 'rejected') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center"
        >
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <Text size="lg" fw={600} className="text-red-600">
            Challenge Rejected
          </Text>
          <Text size="sm" c="dimmed" mt={2}>
            Please try again with clearer evidence
          </Text>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <Paper shadow="sm" radius="lg" className="relative bg-white h-[800px]">
      <MapContainer
        key={mapKey}
        center={WORLD_CENTER}
        zoom={ZOOM_LEVEL}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {challenges.map((challenge) => (
          <Marker
            key={challenge.id}
            position={challenge.location}
            icon={createMarkerIcon(getCategoryColor(challenge.category))}
            eventHandlers={{
              click: () => handleChallengeClick(challenge),
            }}
          >
            <Popup>
              <AnimatePresence mode="wait">
                {selectedChallenge?.id === challenge.id &&
                showCompletionForm ? (
                  completionStatus === 'pending' ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 min-w-[300px]"
                    >
                      <Stack spacing="md">
                        <div>
                          <h2
                            className="text-xl font-bold mb-2"
                            style={{
                              color: getCategoryColor(challenge.category),
                            }}
                          >
                            {challenge.title}
                          </h2>
                          <Text size="sm" c="dimmed" mb="md">
                            {challenge.description}
                          </Text>
                        </div>

                        <div className="space-y-2">
                          <Text fw={500} size="sm">
                            Required Task:
                          </Text>
                          <Paper p="sm" className="bg-blue-50">
                            <Text size="sm" fw={500}>
                              {challenge.task}
                            </Text>
                          </Paper>
                        </div>
                        <FileInput
                          label="Upload Photo Evidence"
                          placeholder="Choose photo"
                          accept="image/*"
                          icon={<Camera size={16} />}
                          required
                          size="sm"
                          onChange={(f) => {
                          if (f) {
                            imagefile = f;
                          }
                          }}
                        />

                        {challenge.category === 'food' && (
                          <>
                            <Rating defaultValue={0} size="lg" />
                            <Textarea
                              label="Your Review"
                              placeholder="Share your experience..."
                              minRows={2}
                              required
                              size="sm"
                              icon={<Heart size={16} />}
                            />
                          </>
                        )}

                        <NumberInput
                          label="Time Spent (minutes)"
                          placeholder="Enter time"
                          min={1}
                          required
                          size="sm"
                          icon={<Clock size={16} />}
                        />

                        <Group justify="flex-end" mt="sm">
                          <Button
                            variant="light"
                            onClick={() => {
                              setShowCompletionForm(false);
                            }}
                            size="sm"
                            style={{
                              color: getCategoryColor(challenge.category),
                            }}
                            className="hover:opacity-90"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSubmit(challenge.tasks.join(', '))}
                            size="sm"
                            style={{
                              backgroundColor: getCategoryColor(
                                challenge.category
                              ),
                            }}
                            className="hover:opacity-90"
                          >
                            Submit Challenge
                          </Button>
                        </Group>
                      </Stack>
                    </motion.div>
                  ) : (
                    renderCompletionStatus()
                  )
                ) : (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 min-w-[300px]"
                  >
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: getCategoryColor(challenge.category) }}
                    >
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {challenge.description}
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock
                          size={16}
                          style={{
                            color: getCategoryColor(challenge.category),
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          {challenge.estimatedTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text size="sm" fw={500}>
                          Difficulty:
                        </Text>
                        <Text
                          size="sm"
                          style={{
                            color: getCategoryColor(challenge.category),
                          }}
                        >
                          {challenge.difficulty}
                        </Text>
                      </div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: getCategoryColor(challenge.category) }}
                      >
                        Points: {challenge.points}
                      </p>
                    </div>

                    <Group grow>
                      <Button
                        variant="light"
                        size="sm"
                        leftSection={<Navigation2 size={16} />}
                        component="a"
                        href={getGoogleMapsUrl(challenge.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: getCategoryColor(challenge.category) }}
                      >
                        Directions
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: getCategoryColor(challenge.category),
                        }}
                        className="hover:opacity-90"
                        onClick={() => {
                          setSelectedChallenge(challenge);
                          setShowCompletionForm(true);
                          if (onChallengeClick) onChallengeClick();
                        }}
                      >
                        Start
                      </Button>
                    </Group>
                  </motion.div>
                )}
              </AnimatePresence>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Paper>
  );
}
