import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../utils/PreferencesContext';

const traits = [
  'Intelligence',
  'Hygiene',
  'Adaptability',
  'Energy',
  'Longevity',
  'Size',
  'FoodCost',
  'Friendliness',
];

const TraitSelectionPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { preferences, updatePreferences } = usePreferences(); // global preferences
  const navigate = useNavigate();

  const handleTraitClick = (trait: string) => {
    navigate(`/trait-detail/${trait}`);
  };

  const weightMapping: Record<string, number> = {
    "I don't care": 0,
    "Not important": 1,
    "Important": 2,
    "Really important": 3,
  };

  const scoreMapping: Record<string, number> = {
    "Very Low": 1,
    "Low": 2,
    "Moderate": 3,
    "High": 4,
    "Very High": 5,
  };

  const reversedScoreMapping: Record<string, number> = {
    "Very Low": 5,
    "Low": 4,
    "Moderate": 3,
    "High": 2,
    "Very High": 1,
  };

  const reversedKeys = new Set(["sheddingLevel", "droolingLevel", "barkingLevel", "foodCost"]);

  const handleSubmit = async () => {
    const backendData: Record<string, string | number> = {};

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const expectedKeys = [
      'size',
      'intelligenceWeight', 'trainabilityLevel', 'mentalSimulationNeeds',

      'hygieneWeight', 'sheddingLevel', 'droolingLevel',
      'friendlinessWeight', 'affectionateWithFamily', 'opennessToStrangers', 'playfulnessLevel',
      'adaptabilityWeight', 'goodWithOtherDogs', 'goodWithChildren'
      , 'energyWeight', 'energyLevel', 'barkingLevel'
      , 'popularityWeight', 'popularity',
      'lengevityWeight',
      'longevity', 'foodCostWeight', 'foodCost'
    ];



    for (const key of expectedKeys) {
      const value = preferences[key];

      if (typeof value === 'string') {
        if (weightMapping[value] !== undefined) {
          backendData[key] = weightMapping[value];
        } else if (scoreMapping[value] !== undefined) {
          backendData[key] = reversedKeys.has(key)
            ? reversedScoreMapping[value]
            : scoreMapping[value];
        } else {
          backendData[key] = value; // likely "size"
        }
      } else if (typeof value === 'number') {
        backendData[key] = value;
      } else {
        backendData[key] = 0; // default fallback
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication error: Please log in.');
      return;
    }

    try {
      console.log(backendData)
      const matchResponse = await axios.post(
        'http://localhost:8005/dogs/perfectMatch',
        backendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const matchResults = matchResponse.data;
      console.log(matchResponse.data)
      await axios.post(
        `http://localhost:8005/dogs/preferencesAndResults/${email}`,
        {
          preferences: backendData,
          results: matchResults,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(matchResponse.data)
      navigate('/topBreeds', { state: { topBreeds: matchResponse.data } });

    } catch (err) {
      console.error('❌ Submission failed:', err);
      setError('Something went wrong. Check the console.');
    }
  };

  const tagLabelMap: Record<string, Record<number | string, string>> = {
    trainabilityLevel: {
      1: 'Not easily trainable',
      2: 'Somewhat trainable',
      3: 'Moderately trainable',
      4: 'Trainable',
      5: 'Easily trainable'
    },
    mentalSimulationNeeds: {
      1: 'Home alone 8+ hrs', 2: 'Home alone 5–8 hrs', 3: 'Home alone 3–5 hrs', 4: 'Home alone 1–3 hrs', 5: 'Rarely home alone',
    },
    sheddingLevel: {
      1: 'Very heavy shedding', 2: 'Heavy shedding', 3: 'Moderate shedding', 4: 'Light shedding', 5: 'Minimal shedding'
    },
    droolingLevel: {
      1: 'Heavy drooler', 2: 'Frequent drool', 3: 'Some drool', 4: 'Occasional drool', 5: 'Minimal drool'
    },
    barkingLevel: {
      1: 'Very vocal', 2: 'Quite vocal', 3: 'Moderate barking', 4: 'Mostly quiet', 5: 'Very quiet'
    },
    affectionateWithFamily: {
      1: 'Independent', 2: 'Slightly affectionate with family', 3: 'Moderately affectionate with family', 4: 'Very affectionate with family', 5: 'Extremely affectionate with family'
    },
    opennessToStrangers: {
      1: 'Reserved with strangers', 2: 'Cautious with strangers', 3: 'Neutral with strangers', 4: 'Friendly with strangers', 5: 'Very outgoing with strangers'
    },
    playfulnessLevel: {
      1: 'Not playful', 2: 'Somewhat playful', 3: 'Moderately playful', 4: 'Playful', 5: 'Very playful'
    },
    goodWithChildren: {
      1: 'Not good with kids', 2: 'Not usually good with kids', 3: 'Sometimes good with kids', 4: 'Usually good with kids', 5: 'Great with kids'
    },
    goodWithOtherDogs: {
      1: 'Not social with other dogs', 2: 'Rarely social with other dogs', 3: 'Sometimes social with other dogs', 4: 'Good with dogs', 5: 'Great with dogs'
    },
    energyLevel: {
      1: 'Very calm', 2: 'Calm', 3: 'Moderate energy', 4: 'Active', 5: 'Very energetic'
    },
    size: {
      "doesn't matter": 'Any size', 'small': 'Small', 'medium': 'Medium', 'large': 'Large'
    },
    foodCost: {
      1: 'Very high food cost', 2: 'High food cost', 3: 'Moderate food cost', 4: 'Low food cost', 5: 'Very low food cost'
    },
    longevity: {
      1: '<9 years of life', 2: '9–12 years of life', 3: '>12 years of life'
    },
  };

  const preferenceChips = Object.entries(preferences)
  .map(([key, value]) => {
    if (typeof value === 'number') {
      const label = tagLabelMap[key]?.[value];
      return label ? { key, label } : null;
    }

    if (key === 'size' && typeof value === 'string') {
      const normalized = value.toLowerCase();
      const label = tagLabelMap[key]?.[normalized];
      return label ? { key, label } : null;
    }

    return null;
  })
  .filter((chip): chip is { key: string; label: string } => chip !== null);



  const handleRemove = (keyToRemove: string) => {
    const updated = { ...preferences };

    // Reset numeric traits to 0 (neutral)
    updated[keyToRemove] = typeof updated[keyToRemove] === 'number' ? 0 : '';

    // Also reset associated weight if it's a known trait group
    const traitWeights: Record<string, string> = {
      trainabilityLevel: 'intelligenceWeight',
      mentalSimulationNeeds: 'intelligenceWeight',
      sheddingLevel: 'hygieneWeight',
      droolingLevel: 'hygieneWeight',
      barkingLevel: 'energyWeight',
      energyLevel: 'energyWeight',
      affectionateWithFamily: 'friendlinessWeight',
      opennessToStrangers: 'friendlinessWeight',
      playfulnessLevel: 'friendlinessWeight',
      goodWithChildren: 'adaptabilityWeight',
      goodWithOtherDogs: 'adaptabilityWeight',
      foodCost: 'foodCostWeight',
      longevity: 'lengevityWeight'
    };

    const weightKey = traitWeights[keyToRemove];
    if (weightKey) {
      updated[weightKey] = 0;
    }

    updatePreferences(updated);
  };


  return (
    <Box
      sx={{
        backgroundColor: '#dcc5a4',
        maxHeight: '89.6vh',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: 'center' }}>
        <Chip label="✓ Preferences" sx={{ backgroundColor: '#2d2d2d', color: 'white' }} />
        {preferenceChips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            onDelete={() => handleRemove(chip.key)}
            deleteIcon={<CloseIcon sx={{ color: 'white' }} />}
            sx={{
              backgroundColor: '#2d2d2d',
              color: 'white',
              '& .MuiChip-deleteIcon': { color: 'white' }
            }}
          />
        ))}
      </Box>

      <Grid container spacing={4} maxWidth="lg" marginTop={6} marginRight={5}>
        {traits.map((trait) => (
          <Grid item xs={12} sm={6} key={trait}>
            <Box sx={{ width: '90%', padding: 5, borderRadius: 2, height: '10px' }}>
              <Button
                onClick={() => handleTraitClick(trait)}
                fullWidth
                sx={{
                  backgroundColor: '#f5ede4',
                  color: 'black',
                  padding: '16px 30px',
                  justifyContent: 'space-between',
                  borderRadius: '0px',
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
                endIcon={<ArrowForwardIcon sx={{ color: '#b46052' }} />}
              >
                {trait}
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          marginRight: '232px',
          marginTop: '40px',
          gap: 2,
          width: '900px',
        }}
      >
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            height: '50px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#E08E84',
          color: 'white',
          paddingX: 4,
          height: '46px',
          borderRadius: '4px',
          width: '10%',
          marginLeft: '965px',
          marginTop: '-50px',
        }}
        onClick={handleSubmit}
      >
        Submit
      </Button>

      {error && (
        <Typography sx={{ marginTop: 2, color: 'red' }}>{error}</Typography>
      )}
    </Box>
  );
};

export default TraitSelectionPage;
