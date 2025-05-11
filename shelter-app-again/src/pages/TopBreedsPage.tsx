import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface BreedProfile {
  name: string;
  // you can add other fields here if needed
}

interface BreedScoreResult {
  breedProfile: BreedProfile;
  compatibiltyPercent: number;
}

const TopBreedsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topBreeds: BreedScoreResult[] = location.state?.topBreeds || [];

  return (
    <Box
      sx={{
        backgroundColor: '#dec4a1',
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 500 }}>
        {topBreeds.map((breed, index) => (
          <Button
            key={index}
            variant="contained"
            fullWidth
            sx={{
              justifyContent: 'space-between',
              backgroundColor: '#f5ecdf',
              color: '#000',
              borderRadius: '999px',
              px: 4,
              py: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.2rem',
              '&:hover': {
                backgroundColor: '#f2e6d3'
              }
            }}
            endIcon={<ArrowForwardIcon sx={{ color: '#c56e52' }} />}
            onClick={() => navigate(`/breeds/${breed.breedProfile.name}`)}
          >
            {breed.breedProfile.name} ({breed.compatibiltyPercent.toFixed(1)}%)
          </Button>
        ))}

      </Stack>
    </Box>
  );
};

export default TopBreedsPage;
