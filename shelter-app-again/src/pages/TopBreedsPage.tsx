import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Collapse,
  Stack,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { addDataUrlPrefix } from '../utils/ImageUtils';

interface BreedProfile {
  name: string;
  size: string;
  affectionateWithFamily: number;
  goodWithChildren: number;
  goodWithOtherDogs: number;
  sheddingLevel: number;
  droolingLevel: number;
  opennessToStrangers: number;
  playfulnessLevel: number;
  trainabilityLevel: number;
  energyLevel: number;
  barkingLevel: number;
  mentalSimulationNeeds: number;
  popularity: number;
  longevity: number;
  foodCost: number;
  imageAdult?: Uint8Array;
  imagePuppy?: Uint8Array;
}

interface BreedScoreResult {
  breedProfile: BreedProfile;
  compatibiltyPercent: number;
}

const tagLabelMap: Record<string, Record<number | string, string>> = {
  trainabilityLevel: {
    0: 'Does not matter',  1: 'Not easily trainable', 2: 'Somewhat trainable', 3: 'Moderately trainable', 4: 'Trainable', 5: 'Easily trainable'
  },
  mentalSimulationNeeds: {
    0: 'Does not matter', 1: 'Home alone 8+ hrs', 2: 'Home alone 5–8 hrs', 3: 'Home alone 3–5 hrs', 4: 'Home alone 1–3 hrs', 5: 'Rarely home alone'
  },
  sheddingLevel: {
    0: 'Does not matter', 1: 'Very heavy shedding', 2: 'Heavy shedding', 3: 'Moderate shedding', 4: 'Light shedding', 5: 'Minimal shedding'
  },
  droolingLevel: {
    0: 'Does not matter', 1: 'Heavy drooler', 2: 'Frequent drool', 3: 'Some drool', 4: 'Occasional drool', 5: 'Minimal drool'
  },
  barkingLevel: {
    0: 'Does not matter', 1: 'Very vocal', 2: 'Quite vocal', 3: 'Moderate barking', 4: 'Mostly quiet', 5: 'Very quiet'
  },
  affectionateWithFamily: {
    0: 'Does not matter', 1: 'Independent', 2: 'Slightly affectionate', 3: 'Moderately affectionate', 4: 'Very affectionate', 5: 'Extremely affectionate'
  },
  opennessToStrangers: {
    0: 'Does not matter', 1: 'Reserved with strangers', 2: 'Cautious with strangers', 3: 'Neutral with strangers', 4: 'Friendly with strangers', 5: 'Very outgoing with strangers'
  },
  playfulnessLevel: {
    0: 'Does not matter', 1: 'Not playful', 2: 'Somewhat playful', 3: 'Moderately playful', 4: 'Playful', 5: 'Very playful'
  },
  goodWithChildren: {
    0: 'Does not matter', 1: 'Not good with kids', 2: 'Rarely good with kids', 3: 'Sometimes good with kids', 4: 'Usually good with kids', 5: 'Great with kids'
  },
  goodWithOtherDogs: {
    0: 'Does not matter', 1: 'Not social with other dogs', 2: 'Rarely social with other dogs', 3: 'Sometimes social with other dogs', 4: 'Good with other dogs', 5: 'Great with other dogs'
  },
  energyLevel: {
    0: 'Does not matter', 1: 'Very calm', 2: 'Calm', 3: 'Moderate energy', 4: 'Active', 5: 'Very energetic'
  },
  foodCost: {
    0: 'Does not matter', 1: 'Very expensive food', 2: 'Expensive food', 3: 'Moderate food cost', 4: 'Low food cost', 5: 'Very cheap food cost'
  },
  longevity: {
    0: 'Does not matter', 1: '<9 years of life', 2: '9–12 years of life', 3: '>12 years of life'
  }
};

const traitKeys = Object.keys(tagLabelMap);

const TopBreedsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const topBreeds: BreedScoreResult[] = location.state?.topBreeds || [];
  const email: string = location.state?.email;
  const rawPreferences: Record<string, number | string> = location.state?.rawPreferences;
  console.log("📬 location.state", location.state);


  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showPuppyMap, setShowPuppyMap] = useState<{ [index: number]: boolean }>({});

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleImage = (index: number) => {
    setShowPuppyMap(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const sendPreferencesAndResults = async () => {
      if (!email || !rawPreferences || !topBreeds.length) return;

      const mappedPreferences: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(rawPreferences)) {
        if (key.endsWith('Weight')) {
          mappedPreferences[key] = value;
        } else if (typeof value === 'number' && tagLabelMap[key]) {
          mappedPreferences[key] = tagLabelMap[key][value] ?? value;
        } else {
          mappedPreferences[key] = value;
        }
      }

      const mappedResults = topBreeds.map(({ breedProfile, compatibiltyPercent }) => {
        const mappedBreed: Record<string, string | number> = {
          name: breedProfile.name,
          size: breedProfile.size,
          compatibiltyPercent: `${compatibiltyPercent.toFixed(1)}%`,
        };

        for (const [key, value] of Object.entries(breedProfile)) {
          if (['name', 'size', 'imageAdult', 'imagePuppy'].includes(key)) continue;

          if (typeof value === 'number' && tagLabelMap[key]) {
            mappedBreed[key] = tagLabelMap[key][value] ?? value;
          } else if (typeof value === 'string' || typeof value === 'number') {
            mappedBreed[key] = value;
          }
        }

        return mappedBreed;
      });
      console.log(mappedResults)

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        console.log(mappedPreferences)
        console.log(mappedResults)
        await axios.post(
          `http://localhost:8005/dogs/preferencesAndResults/${email}`,
          {
            preferences: mappedPreferences,
            results: topBreeds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (err) {
        console.error('❌ Failed to send preferences and results:', err);
      }
    };

    sendPreferencesAndResults();
  }, [email, rawPreferences, topBreeds]);

  return (
    <Box sx={{ backgroundColor: '#dec4a1', minHeight: '100vh', p: 4 }}>
      <Grid container spacing={3} rowSpacing={20} justifyContent="center" marginTop={-20}>
        {topBreeds.map((breed, index) => {
          const showPuppy = showPuppyMap[index] ?? false;
          const imageBytes = showPuppy ? breed.breedProfile.imagePuppy : breed.breedProfile.imageAdult;
          const base64 = imageBytes?.toString();
          const imageType: "jpeg" | "png" = base64?.includes("/9j/") ? "jpeg" : "png";
          const imageSrc = base64 ? addDataUrlPrefix(base64, imageType) : 'https://via.placeholder.com/300x140';

          return (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Card sx={{ borderRadius: 2, bgcolor: '#fff', position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={imageSrc}
                  alt={breed.breedProfile.name}
                />
                <IconButton
                  onClick={() => toggleImage(index)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                  }}
                >
                  <SwapHorizIcon />
                </IconButton>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    px: 2,
                    py: 1,
                    minHeight: '56px',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '140px',
                    }}
                  >
                    {breed.breedProfile.name} {breed.compatibiltyPercent.toFixed(0)}%
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => toggleExpand(index)} size="small">
                      {expandedIndex === index ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </IconButton>
                    <IconButton onClick={() => navigate(`/breeds/${breed.breedProfile.name}`)} size="small">
                      <ArrowForwardIcon sx={{ color: '#c56e52' }} />
                    </IconButton>
                  </Stack>
                </CardContent>
                <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2"><strong>Name:</strong> {breed.breedProfile.name}</Typography>
                    <Typography variant="body2"><strong>Compatibility Percent:</strong> {breed.compatibiltyPercent}%</Typography>
                    <Typography variant="body2"><strong>Size:</strong> {breed.breedProfile.size}</Typography>
                    {traitKeys.map(key => {
                      const val = breed.breedProfile[key as keyof BreedProfile];
                      const label = tagLabelMap[key]?.[val as number | string];
                      return label ? (
                        <Typography key={key} variant="body2">{label}</Typography>
                      ) : null;
                    })}
                  </Box>
                </Collapse>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TopBreedsPage;
