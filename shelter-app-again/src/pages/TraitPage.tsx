// TraitPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


import { Box, Typography, RadioGroup, Radio, FormControlLabel, Button, Chip } from '@mui/material';
import { usePreferences } from '../utils/PreferencesContext';

const traitData = {
    Intelligence: {
        subtraits: [
            {
                label: 'How easy should the dog be to train?',
                key: 'trainabilityLevel',
                weightKey: 'trainabilityWeight',
                options: [
                    { label: 'Training doesn’t matter', score: 1 },
                    { label: 'Some obedience is fine', score: 2 },
                    { label: 'Balanced', score: 3 },
                    { label: 'I want a responsive learner', score: 4 },
                    { label: 'Very easy to train', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
            {
                label: 'How many hours a day will the dog be left alone?',
                key: 'mentalSimulationNeeds',
                weightKey: 'mentalSimulationNeedsWeight',
                options: [
                    { label: 'More than 8 hours', score: 1 },
                    { label: '5-8 hours', score: 2 },
                    { label: '3-5 hours', score: 3 },
                    { label: '1-3 hours', score: 4 },
                    { label: 'Almost never', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            }
        ]
    }
    ,
    Hygiene: {
        subtraits: [
            {
                label: 'How much shedding can you tolerate?',
                key: 'sheddingLevel',
                weightKey: 'sheddingWeight',
                options: [
                    { label: 'Shedding doesn’t bother me at all, even a lot is fine', score: 1 },
                    { label: 'I can handle heavy shedding, like daily hair', score: 2 },
                    { label: 'Regular shedding is acceptable with some cleaning', score: 3 },
                    { label: 'Light shedding is okay, but not constant', score: 4 },
                    { label: 'I want a dog that barely sheds at all', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
            {
                label: ' How much drooling can you tolerate?',
                key: 'droolingLevel',
                weightKey: 'droolingWeight',
                options: [
                    { label: 'I’m fine with heavy drooling, even daily or constant', score: 1 },
                    { label: 'I can handle frequent drooling', score: 2 },
                    { label: 'A little drool around food or excitement is okay', score: 3 },
                    { label: 'Occasional drool is fine, but I’d prefer less', score: 4 },
                    { label: 'I want a dog that almost never drools', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
        ],
    },
    Adaptability: {
        subtraits: [
            {
                label: "Do you have other pets or plan for your dog to interact with other animals often?",
                key: "goodWithOtherDogs",
                weightKey: 'goodWithOtherDogsWeight',
                options: [
                    { label: 'No, and dog doesn’t need to be friendly', score: 1 },
                    { label: 'Rarely', score: 2 },
                    { label: 'Sometimes', score: 3 },
                    { label: 'Often', score: 4 },
                    { label: 'Always around other pets', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
            {
                label: "Do you have children or will children often be around?",
                key: "goodWithChildren",
                weightKey: 'goodWithChildrenWeight',
                options: [
                    { label: 'No, and dog doesn’t need to be kid-friendly', score: 1 },
                    { label: 'Rarely', score: 2 },
                    { label: 'Occasionally', score: 3 },
                    { label: 'Often', score: 4 },
                    { label: 'Always, needs to be kid-safe', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            }
        ],
    },

    Friendliness: {
        subtraits: [
            {
                label: "How affectionate should your dog be with family?",
                key: "affectionateWithFamily",
                weightKey: 'affectionateWithFamilyWeight',
                options: [
                    { label: 'Independent, not clingy', score: 1 },
                    { label: 'Affectionate at times', score: 2 },
                    { label: 'Balanced affection', score: 3 },
                    { label: 'Very affectionate', score: 4 },
                    { label: 'Extremely cuddly, people-focused', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
            {
                label: "How friendly should your dog be with strangers?",
                key: "opennessToStrangers",
                weightKey: 'opennessToStrangersWeight',
                options: [
                    { label: 'Reserved/protective', score: 1 },
                    { label: 'Slightly cautious', score: 2 },
                    { label: 'Neutral', score: 3 },
                    { label: 'Friendly and sociable', score: 4 },
                    { label: 'Very outgoing', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
            {
                label: "How playful should your dog be?",
                key: "playfulnessLevel",
                weightKey: 'playfulnessWeight',
                options: [
                    { label: 'Not playful at all', score: 1 },
                    { label: 'A little play is fine', score: 2 },
                    { label: 'Balanced', score: 3 },
                    { label: 'Playful and fun-loving', score: 4 },
                    { label: 'Constantly wants to play', score: 5 },
                    { label: 'I don’t care', score: 0 },
                ]
            }
        ],
    },

    Energy: {
        subtraits: [
            {
                label: "How energetic should your ideal dog be?",
                key: "energyLevel",
                weightKey: 'energyWeight',
                options: [
                    { label: 'Very calm (minimal activity)', score: 1 },
                    { label: 'Calm (short walks/play)', score: 2 },
                    { label: 'Moderate activity', score: 3 },
                    { label: 'Active (daily exercise)', score: 4 },
                    { label: 'Very energetic (high physical engagement)', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            },
            {
                label: "How much barking are you okay with?",
                key: "barkingLevel",
                weightKey: 'barkingWeight',
                options: [
                    { label: 'Very quiet only', score: 5 },
                    { label: 'Occasional barking is fine', score: 4 },
                    { label: 'Moderate barking is okay', score: 3 },
                    { label: 'I’m fine with a vocal dog', score: 2 },
                    { label: 'Barking doesn’t bother me at all', score: 1 },
                    { label: 'I don’t care', score: 0 }
                ]
            }
        ],
    },

    Longevity: {
        subtraits: [
            {
                label: "How long do you want your dog to live?",
                key: "longevity",
                weightKey: 'longevityWeight',
                options: [
                    { label: 'Less than 9 years', score: 1 },
                    { label: 'Between 9 and 12 years', score: 2 },
                    { label: 'More than 12 years', score: 3 },
                    { label: 'I don’t care', score: 0 }
                ]
            }
        ],
    },

    FoodCost: {
        subtraits: [
            {
                label: "How much can you afford for food annually?",
                key: "foodCost",
                weightKey: 'foodCostWeight',
                options: [
                    { label: 'I can afford high food costs', score: 1 },
                    { label: 'I’m comfortable with higher food expenses', score: 2 },
                    { label: 'I prefer average or medium food costs', score: 3 },
                    { label: 'I’m looking for breeds with low food needs', score: 4 },
                    { label: 'I can only afford very low food costs ', score: 5 },
                    { label: 'I don’t care', score: 0 }
                ]
            }
        ],
    },
    Size: {
        options: ['small', 'medium', 'large', "doesn't matter"]
    }

};

const scoreOptions = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
const weightOptions = ['Not important', 'Important', 'Really important', "I don't care"];

const TraitPage: React.FC = () => {
    const { trait } = useParams<{ trait: string }>();
    const navigate = useNavigate();
    const { updatePreferences } = usePreferences();
    const [answers, setAnswers] = useState<Record<string, string>>({});

    if (!trait || !traitData[trait as keyof typeof traitData]) return <Typography>Invalid trait</Typography>;

    const typedTrait = trait as keyof typeof traitData;
    const isSizeTrait = typedTrait === 'Size';

    const handleChange = (key: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (isSizeTrait) {
            updatePreferences({ size: answers['size'] });
        } else {
            const subtraits = traitData[typedTrait].subtraits;
            const updated: Record<string, number> = {};

            subtraits.forEach(({ key, options, weightKey }) => {
                const selected = answers[key];
                const option = options.find((o) => o.label === selected);
                const score = option?.score ?? 0;

                updated[key] = score;
                updated[weightKey] = score === 0 ? 0 : score >= 4 ? 3 : score === 3 ? 2 : 1;
            });

            updatePreferences(updated);
        }

        navigate('/toForm');
    };

    return (
        <Box
            sx={{
                minHeight: '87.5vh',
                backgroundColor: '#F5EDE3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 6,
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    maxWidth: '1000px',
                    backgroundColor: '#F5EDE3',
                    padding: 4,
                }}
            >
                <Typography variant="h4" gutterBottom textAlign="center">
                    {trait}
                </Typography>

                {isSizeTrait ? (
                    <>
                        <Typography sx={{ textAlign: "center" }} variant="h6">
                            Select your preferred size:
                        </Typography>
                        <RadioGroup
                            value={answers['size'] || ''}
                            onChange={(e) => handleChange('size', e.target.value)}
                            sx={{
                                justifyContent: "center",
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                mt: 2,
                            }}
                        >
                            {traitData['Size'].options.map((opt) => (
                                <FormControlLabel
                                    key={opt}
                                    value={opt}
                                    control={<Radio />}
                                    label={opt}
                                />
                            ))}
                        </RadioGroup>
                    </>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 6,
                        }}
                    >
                        {traitData[typedTrait].subtraits.map(({ label, key, options }) => (
                            <Box
                                key={key}
                                sx={{
                                    marginTop: '40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    mb: 4,
                                }}
                            >
                                <Typography variant="subtitle1" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    {label}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        gap: 2,
                                    }}
                                >
                                    {(options || []).map((opt) => (
                                        <Box
                                            key={`${key}-${opt.label}`}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: '140px',
                                            }}
                                        >
                                            <Radio
                                                checked={answers[key] === opt.label}
                                                onChange={() => handleChange(key, opt.label)}
                                                value={opt.label}
                                            />
                                            <Typography variant="body2" align="center">
                                                {opt.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ backgroundColor: '#E08E84', color: 'black' }}
                    >
                        Save & Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default TraitPage;


