'use client';

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// Updated to center on a more global view
const WORLD_CENTER: [number, number] = [20, 0];

const challenges = [
  {
    id: 1,
    title: 'Eiffel Tower Adventure',
    location: [48.8584, 2.2945] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Experience the iconic Eiffel Tower and its surrounding gardens.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    tasks: [
      'Take a photo from the top observation deck',
      'Find the hidden Gustav Eiffel apartment',
      'Capture the tower sparkling at night',
      'Visit the Champ de Mars gardens',
    ],
  },
  {
    id: 2,
    title: 'Tokyo Street Food Safari',
    location: [35.6762, 139.6503] as [number, number],
    category: 'food',
    points: 250,
    description: 'Explore the vibrant street food scene in Tokyo.',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    tasks: [
      'Try takoyaki in Shibuya',
      'Sample ramen in a local shop',
      'Visit Tsukiji Outer Market',
      'Find a unique vending machine snack',
    ],
  },
  {
    id: 3,
    title: 'Colosseum Time Travel',
    location: [41.8902, 12.4922] as [number, number],
    category: 'cultural',
    points: 350,
    description: 'Step back in time at the magnificent Roman Colosseum.',
    difficulty: 'Hard',
    estimatedTime: '4-5 hours',
    tasks: [
      'Document the different levels of the arena',
      'Find the underground tunnels',
      'Photograph the Arch of Constantine',
      'Visit the Roman Forum nearby',
    ],
  },
  {
    id: 4,
    title: 'Sydney Harbor Challenge',
    location: [-33.8568, 151.2153] as [number, number],
    category: 'adventure',
    points: 400,
    description: 'Experience the best of Sydney Harbor.',
    difficulty: 'Expert',
    estimatedTime: '5-6 hours',
    tasks: [
      'Climb the Sydney Harbor Bridge',
      'Watch a performance at the Opera House',
      'Take the Manly Ferry',
      'Visit the Royal Botanic Garden',
    ],
  },
  {
    id: 5,
    title: 'Dubai Heights',
    location: [25.1972, 55.2744] as [number, number],
    category: 'adventure',
    points: 450,
    description: 'Explore the vertical wonders of Dubai.',
    difficulty: 'Expert',
    estimatedTime: '4-5 hours',
    tasks: [
      'Visit the Burj Khalifa observation deck',
      'Dine at At.mosphere restaurant',
      'Visit the Dubai Mall',
      'Watch the Dubai Fountain show',
    ],
  },
  {
    id: 6,
    title: 'Barcelona Gaudi Tour',
    location: [41.4036, 2.1744] as [number, number],
    category: 'cultural',
    points: 300,
    description: 'Discover the architectural wonders of Antoni Gaudi.',
    difficulty: 'Medium',
    estimatedTime: '6-7 hours',
    tasks: [
      'Visit Sagrada Familia',
      'Explore Park Güell',
      'Tour Casa Batlló',
      'Find Casa Milà',
    ],
  },
  {
    id: 7,
    title: 'Singapore Food Adventure',
    location: [1.3521, 103.8198] as [number, number],
    category: 'food',
    points: 200,
    description: 'Experience the diverse flavors of Singapore.',
    difficulty: 'Easy',
    estimatedTime: '4-5 hours',
    tasks: [
      'Visit a hawker center',
      'Try Hainanese chicken rice',
      'Sample chili crab',
      'Explore Chinatown Food Street',
    ],
  },
  {
    id: 8,
    title: 'New York City Landmarks',
    location: [40.7128, -74.0060] as [number, number],
    category: 'adventure',
    points: 350,
    description: 'Explore the iconic landmarks of NYC.',
    difficulty: 'Hard',
    estimatedTime: '8-9 hours',
    tasks: [
      'Visit Times Square',
      'Walk across Brooklyn Bridge',
      'Tour Central Park',
      'Visit the Statue of Liberty',
    ],
  }
];

interface MapProps {
  onChallengeClick?: () => void;
}

const categoryColors = {
  adventure: '#DC2626',
  cultural: '#7C3AED',
  food: '#059669',
  nature: '#2563EB',
};

const difficultyPoints = {
  Easy: 100,
  Medium: 200,
  Hard: 300,
  Expert: 400,
};

export default function Map({ onChallengeClick }: MapProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<
    (typeof challenges)[0] | null
  >(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<
    'pending' | 'loading' | 'accepted' | 'rejected'
  >('pending');
  const [mapKey] = useState(() => Math.random());
  
  // Use refs to store timeouts
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const resetTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

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

  const handleSubmit = () => {
    setCompletionStatus('loading');

    // Clear any existing timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // Set new timeouts using refs
    loadingTimeoutRef.current = setTimeout(() => {
      const isAccepted = Math.random() > 0.5;
      setCompletionStatus(isAccepted ? 'accepted' : 'rejected');

      resetTimeoutRef.current = setTimeout(() => {
        setCompletionStatus('pending');
        setShowCompletionForm(false);
        setSelectedChallenge(null);
      }, 3000);
    }, 2000);
  };

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
        zoom={2}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {challenges.map((challenge) => (
          <Marker
            key={challenge.id}
            position={challenge.location}
            icon={createMarkerIcon(getCategoryColor(challenge.category))}
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
                            Required Tasks:
                          </Text>
                          <List size="sm" spacing="xs">
                            {challenge.tasks.map((task, index) => (
                              <List.Item
                                key={index}
                                icon={<CheckSquare size={16} />}
                              >
                                {task}
                              </List.Item>
                            ))}
                          </List>
                        </div>

                        <FileInput
                          label="Upload Photos"
                          placeholder="Choose photos"
                          accept="image/*"
                          icon={<Camera size={16} />}
                          required
                          multiple
                          size="sm"
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
                            onClick={() => setShowCompletionForm(false)}
                            size="sm"
                            style={{
                              color: getCategoryColor(challenge.category),
                            }}
                            className="hover:opacity-90"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            size="sm"
                            style={{
                              backgroundColor: getCategoryColor(
                                challenge.category
                              ),
                            }}
                            className="hover:opacity-90"
                          >
                            Submit
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

                    <div className="space-y-2 mb-4">
                      <Text fw={500} size="sm">
                        Required Tasks:
                      </Text>
                      <List size="sm" spacing="xs">
                        {challenge.tasks.map((task, index) => (
                          <List.Item
                            key={index}
                            icon={<CheckSquare size={16} />}
                          >
                            {task}
                          </List.Item>
                        ))}
                      </List>
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