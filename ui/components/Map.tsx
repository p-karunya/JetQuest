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
import { Session } from 'node:inspector';
import { useRouter } from 'next/router';

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

const storage = new Storage(AppClient);

const FileURL = storage.getFileDownload(
    '67b22408001089da181d', 
    '67b237a000367421bee5' 
);

console.log(FileURL);
const response = await fetch(FileURL);
const data = await response.json();
const challenges = data;

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
  const [completionStatuses, setCompletionStatuses] = useState<Record<number, 'pending' | 'loading' | 'accepted' | 'rejected'>>({});


  const [mapCenter, setMapCenter] = useState<[number, number]>(WORLD_CENTER);
  const [mapZoom, setMapZoom] = useState(ZOOM_LEVEL);
  const [mapKey] = useState(() => Math.random());
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
    setCompletionStatuses(prev => ({
      ...prev,
      [challenge.id]: 'pending'
    }));
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
  function transformToValidString(input: string) {
    // Remove invalid characters
    let transformed = input.replace(/[^a-zA-Z0-9._-]/g, '');
  
    // Trim to max 36 characters
    transformed = transformed.slice(0, 36);
  
    // Ensure it doesn't start with a special character
    if (/^[._-]/.test(transformed)) {
      transformed = transformed.replace(/^[._-]+/, '');
    }
  
    // If empty after cleaning, default to 'default_name'
    if (transformed.length === 0) {
      transformed = 'default_name';
    }
  
    return transformed;
  }

  const handleSubmit = async (challenge: (typeof challenges)[0]) => {
    let winpoint: boolean = false;
    setCompletionStatuses(prev => ({
      ...prev,
      [challenge.id]: 'loading'
    }));
  
    const params = {
      reqs: challenge.task,
      url: await getFileUrl(imagefile),
    };
  
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
      
      if (responseBody.taskCompleted === 'true') {
        winpoint = true;
      }

      setCompletionStatuses(prev => ({
        ...prev,
        [challenge.id]: responseBody.taskCompleted === 'true' ? 'accepted' : 'rejected'
      }));
    } catch (error) {
      console.error('Error executing function:', error);
      setCompletionStatuses(prev => ({
        ...prev,
        [challenge.id]: 'rejected'
      }));
    }
    if (winpoint) {     
      let userName = '';
      
      const userString = sessionStorage.getItem('user');

      if (userString) {
          // Parse the JSON string to an object
        const user = JSON.parse(userString);
        userName = user.name;
      } else {
        const router = useRouter();
        router.push('/login');
      }
        
        // Initialize Appwrite storage with your AppClient instance
        const storage = new Storage(AppClient);

        // Replace these placeholders with your actual bucket ID and file ID
        const bucketId = '67b227840031b7167827';
        const fileId = transformToValidString(userName);
        console.log("fileId: ", fileId);

        // Retrieve the download URL for the JSON file
        const fileUrl = storage.getFileDownload(bucketId, fileId);

        console.log('Fetching user profile from:', fileUrl);

        // Fetch the JSON file from Appwrite storage
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        const JSONFile = await response.json()

        JSONFile.completedChallenges += 1;
        JSONFile.points += challenge.points;
        JSONFile.RecentEvents.push({
          id: challenge.id,
          name: challenge.title,
          description: challenge.description,
          date: new Date().toISOString(),})
        JSONFile.stats[challenge.category] += 1;
        
        const userBlob = new Blob([JSON.stringify(JSONFile)], { type: 'application/json' });
        const updatedFileName = transformToValidString(userName);
        const userJSONFile = new File([userBlob], `${updatedFileName}.json`, { type: 'application/json' });
        
        const del = await storage.deleteFile(bucketId, fileId);
        console.log("deleted: ", del);

        const userFile = await storage.createFile(
          bucketId, 
          fileId, 
          userJSONFile, 
          ["read(\"any\")"]
        );
  };}
  
  
  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || '#2563EB';
  };

  const createMarkerIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="challenge-marker" style="background-color: ${color};"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getGoogleMapsUrl = (location: [number, number]) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${location[0]},${location[1]}`;
  };

  const renderCompletionStatus = (challengeId: number) => {
    const status = completionStatuses[challengeId];
    
    if (status === 'loading') {
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
    if (status === 'accepted') {
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
    if (status === 'rejected') {
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
              click: () => {
                handleChallengeClick(challenge);
                setCompletionStatuses(prev => ({
                  ...prev,
                  [challenge.id]: 'pending'
                }));
              },
            }}
            
          >
            <Popup closeButton={true}>
              <AnimatePresence mode="wait">
              {selectedChallenge?.id === challenge.id &&
showCompletionForm ? (
  completionStatuses[challenge.id] === 'pending' ? (
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
            onClick={() => handleSubmit(challenge)}
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
    renderCompletionStatus(challenge.id)
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
