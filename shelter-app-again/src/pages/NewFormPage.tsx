import React, { useEffect, useState } from 'react';
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
  const { preferences, updatePreferences } = usePreferences();
  const navigate = useNavigate();
  


  const handleTraitClick = (trait: string) => {
    navigate(`/trait-detail/${trait}`);
  };

  const weightMapping: Record<string, number> = {
    "I don't care": 0,
    'Not important': 1,
    'Important': 2,
    'Really important': 3,
  };

  const handleSubmit = async () => {
    const backendData: Record<string, string | number> = {};

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const expectedKeys = [
      'size',
      'trainabilityLevel', 'trainabilityWeight',
      'mentalSimulationNeeds', 'mentalSimulationNeedsWeight',
      'sheddingLevel', 'sheddingWeight',
      'droolingLevel', 'droolingWeight',
      'affectionateWithFamily', 'affectionateWithFamilyWeight',
      'opennessToStrangers', 'opennessToStrangersWeight',
      'playfulnessLevel', 'playfulnessWeight',
      'goodWithOtherDogs', 'goodWithOtherDogsWeight',
      'goodWithChildren', 'goodWithChildrenWeight',
      'energyLevel', 'energyWeight',
      'barkingLevel', 'barkingWeight',
      'longevity', 'longevityWeight',
      'foodCost', 'foodCostWeight',
      'popularity', 'popularityWeight'
    ];

    for (const key of expectedKeys) {
      const value = preferences[key];
      backendData[key] = typeof value === 'number' || typeof value === 'string' ? value : 0;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication error: Please log in.');
      return;
    }

    try {
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

      /* await axios.post(
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
       );*/

      //navigate('/topBreeds', { state: { topBreeds: matchResults } });
      navigate('/topBreeds', {
        state: {
          topBreeds: matchResults,
          email,
          rawPreferences: backendData
        }
      });
    } catch (err) {
      console.error('❌ Submission failed:', err);
      setError('Something went wrong. Check the console.');
    }
  };

  const tagLabelMap: Record<string, Record<number | string, string>> = {
    trainabilityLevel: {
      1: 'Not easily trainable', 2: 'Somewhat trainable', 3: 'Moderately trainable', 4: 'Trainable', 5: 'Easily trainable'
    },
    mentalSimulationNeeds: {
      0: 'Does not matter', 1: 'Home alone 8+ hrs', 2: 'Home alone 5–8 hrs', 3: 'Home alone 3–5 hrs', 4: 'Home alone 1–3 hrs', 5: 'Rarely home alone',
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
      0: 'Does not matter', 1: 'Reserved', 2: 'Cautious', 3: 'Neutral', 4: 'Friendly', 5: 'Very outgoing'
    },
    playfulnessLevel: {
      0: 'Does not matter', 1: 'Not playful', 2: 'Somewhat playful', 3: 'Moderately playful', 4: 'Playful', 5: 'Very playful'
    },
    goodWithChildren: {
      0: 'Does not matter', 1: 'Not good', 2: 'Rarely good', 3: 'Sometimes good', 4: 'Usually good', 5: 'Great with kids'
    },
    goodWithOtherDogs: {
      0: 'Does not matter', 1: 'Not social', 2: 'Rarely social', 3: 'Sometimes social', 4: 'Good with dogs', 5: 'Great with dogs'
    },
    energyLevel: {
      0: 'Does not matter', 1: 'Very calm', 2: 'Calm', 3: 'Moderate', 4: 'Active', 5: 'Very energetic'
    },
    size: {
      "doesn't matter": 'Any size', 'small': 'Small', 'medium': 'Medium', 'large': 'Large'
    },
    foodCost: {
      0: 'Does not matter', 1: 'Very high', 2: 'High', 3: 'Moderate', 4: 'Low', 5: 'Very low'
    },
    longevity: {
      0: 'Does not matter', 1: '<9 years', 2: '9–12 years', 3: '>12 years'
    },
  };

  var preferenceChips = Object.entries(preferences)
    .filter(([_, value]) => value !== '' && value !== 0)
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
    updated[keyToRemove] = typeof updated[keyToRemove] === 'number' ? 0 : '';
    updatePreferences(updated);
  };

  return (
    <Box sx={{ backgroundColor: '#dcc5a4', maxHeight: '89.6vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5, justifyContent: 'center' }}>
        <Chip label="✓ Preferences" sx={{ backgroundColor: '#2d2d2d', color: 'white' }} />
        {preferenceChips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            onDelete={() => handleRemove(chip.key)}
            deleteIcon={<CloseIcon sx={{ color: 'white' }} />}
            sx={{ backgroundColor: '#2d2d2d', color: 'white', '& .MuiChip-deleteIcon': { color: 'white' } }}
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

      <Box sx={{ marginRight: '232px', marginTop: '40px', gap: 2, width: '900px' }}>
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
