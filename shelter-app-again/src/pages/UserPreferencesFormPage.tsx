import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TRAITS = [
    {
        label: "intelligence",
        weightKey: "intelligenceWeight",
        subtraits: [
            { label: "Trainability Level (How easily can the dog be trained?)", key: "trainabilityLevel" },
            { label: "Mental Simulation Needs (How much mental stimulation the dog needs to stay happy)", key: "mentalSimulationNeeds" }
        ]
    },
    {
        label: "hygiene",
        weightKey: "hygieneWeight",
        subtraits: [
            {
                label: (
                    <>
                        Shedding Level <br />
                        <small style={{ fontWeight: "normal" }}>
                            (How much fur the dog loses — sheds: low = rarely, medium = seasonally, high = heavily)
                        </small>
                    </>
                ), key: "sheddingLevel"
            }
            ,
            {
                label: (
                    <>
                        Drooling Level <br />
                        <small style={{ fontWeight: "normal" }}>
                            (How often the dog drools: low = barely, medium = occasionally, high = often)
                        </small>
                    </>
                ),
                key: "droolingLevel"
            }

        ]
    },
    {
        label: "friendliness",
        weightKey: "friendlinessWeight",
        subtraits: [
            { label: "Affectionate with Family", key: "affectionateWithFamily" },
            { label: "Openness to Strangers", key: "opennessToStrangers" },
            { label: "Playfulness Level", key: "playfulnessLevel" }
        ]
    },
    {
        label: "adaptability",
        weightKey: "adaptabilityWeight",
        subtraits: [
            { label: "Good with Other Dogs", key: "goodWithOtherDogs" },
            { label: "Good with Children", key: "goodWithChildren" }
        ]
    },
    {
        label: "energy",
        weightKey: "energyWeight",
        subtraits: [
            { label: "Energy Level", key: "energyLevel" },
            { label: "Barking Level (low:rarely barks,medium:occasional barking,high:barks often)", key: "barkingLevel" }
        ]
    },
    {
        label: "popularity",
        weightKey: "popularityWeight",
        subtraits: [
            { label: "Popularity", key: "popularity" }
        ]
    },
    {
        label: "longevity",
        weightKey: "lengevityWeight",
        subtraits: [
            { label: "Longevity", key: "longevity" }
        ]
    },
    {
        label: "food cost",
        weightKey: "foodCostWeight",
        subtraits: [
            { label: "Food Cost", key: "foodCost" }
        ]
    }
];

type WeightLabel = "Not important" | "Important" | "Really important" | "I don't care";
type ScoreLabel = "Low" | "High" | "Very High" | "Very Low" | "Moderate";
type FormValue = WeightLabel | ScoreLabel;

const weightOptions: Record<WeightLabel, number> = {
    "Not important": 1,
    "Important": 2,
    "Really important": 3,
    "I don't care": 0
};

const scoreOptions: Record<ScoreLabel, number> = {
    "Very Low": 1,
    "Low": 2,
    "Moderate": 3,
    "High": 4,
    "Very High": 5
};

const reversedScoreOptions: Record<ScoreLabel, number> = {
    "Very Low": 5,
    "Low": 4,
    "Moderate": 3,
    "High": 2,
    "Very High": 1
};

function isWeightLabel(value: any): value is WeightLabel {
    return Object.keys(weightOptions).includes(value);
}

function isScoreLabel(value: any): value is ScoreLabel {
    return Object.keys(scoreOptions).includes(value);
}



const UserPreferencesFormPage: React.FC = () => {
    const [formData, setFormData] = useState<Record<string, FormValue | string>>({});

    const navigate = useNavigate();
    const [matchResult, setMatchResult] = useState(null);
    const [error, setError] = useState<string | null>(null);


    const reversedKeys = new Set(["sheddingLevel", "droolingLevel", "barkingLevel", "foodCost"]);


    const handleChange = (key: string, value: FormValue | string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };


    const handleSubmit = async () => {
        const backendData: Record<string, number | string> = {};
        const email = formData.email;

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            setError("Please enter a valid email address.");
            return;
        }

        // Add size if provided
        if (formData.size) {
            backendData["size"] = formData.size as string;
        }

        // Transform the rest of the formData
        for (const key in formData) {
            const value = formData[key];

            if (key === "email" || key === "size") continue;

            if (isWeightLabel(value)) {
                backendData[key] = weightOptions[value];
            } else if (isScoreLabel(value)) {
                backendData[key] = reversedKeys.has(key)
                    ? reversedScoreOptions[value]
                    : scoreOptions[value];
            }
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }

        try {
            // 1. Fetch perfect matches to show them
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
            navigate('/topBreeds', { state: { topBreeds: matchResponse.data } });

            // 2. Send preferences + results to email
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

            // 3. Navigate to topBreeds page with result
            

        } catch (error: any) {
            console.error('❌ Error during match or email process:', error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
            setError("Something went wrong. Check the console for details.");
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#F5EDE3",
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                py: 4,
                px: 2,
            }}
        >
            <Box
                sx={{
                    marginLeft: "20px",
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <FormControl component="fieldset" sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D86B5C' }} variant="h6">
                        Your email
                    </Typography>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            width: '50%',
                            fontSize: '16px',
                        }}
                    />
                </FormControl>

                <Typography sx={{ fontWeight: 'bold' }} variant="h4" gutterBottom>
                    Choose the desired traits for your future dog
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#D86B5C' }} variant="h6">
                        Dog size
                    </Typography>
                    <RadioGroup
                        value={formData.size || ''}
                        onChange={(e) => handleChange('size', e.target.value as FormValue)}
                    >
                        <FormControlLabel value="small" control={<Radio />} label="Small" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="large" control={<Radio />} label="Large" />
                        <FormControlLabel value="any" control={<Radio />} label="Doesn't matter" />
                    </RadioGroup>
                </FormControl>

                {TRAITS.map(({ label, weightKey, subtraits }) => (
                    <Box key={label} sx={{ mb: 2, color: "#E08E84" }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#D86B5C' }} variant="h6">
                            {label}
                        </Typography>

                        <FormControl component="fieldset" sx={{ mt: 1 }}>
                            <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                                How important is {label}?
                            </Typography>
                            <RadioGroup
                                value={formData[weightKey] || ''}
                                onChange={(e) => handleChange(weightKey, e.target.value as FormValue)}
                            >
                                {Object.keys(weightOptions).map((opt) => (
                                    <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {subtraits.map(({ label: subLabel, key }) => (
                            <FormControl key={key} component="fieldset" sx={{ mt: 1, marginLeft: "20px" }}>
                                <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                                    {subLabel}
                                </Typography>
                                <RadioGroup
                                    value={formData[key] || ''}
                                    onChange={(e) => handleChange(key, e.target.value as FormValue)}
                                >
                                    {Object.keys(scoreOptions).map((opt) => (
                                        <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        ))}
                    </Box>
                ))}

                <Button
                    sx={{
                        backgroundColor: "#E08E84",
                        color: "black",
                        width: "150px",
                        marginLeft: "1100px"
                    }}
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>

                {matchResult && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5">Perfect Match Results</Typography>
                        <pre>{JSON.stringify(matchResult, null, 2)}</pre>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default UserPreferencesFormPage;
