// TraitPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


import { Box, Typography, RadioGroup, Radio, FormControlLabel, Button, Chip } from '@mui/material';
import { usePreferences } from '../utils/PreferencesContext';

const traitData = {
    Intelligence: {
        weightKey: 'intelligenceWeight',
        subtraits: [
            {
                label: 'How easy should the dog be to train?',
                key: 'trainabilityLevel',
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
        weightKey: 'hygieneWeight',
        subtraits: [
            {
                label: 'How much shedding can you tolerate?',
                key: 'sheddingLevel',
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
        weightKey: "adaptabilityWeight",
        subtraits: [
            {
                label: "Do you have other pets or plan for your dog to interact with other animals often?",
                key: "goodWithOtherDogs",
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
        weightKey: "friendlinessWeight",
        subtraits: [
            {
                label: "How affectionate should your dog be with family?",
                key: "affectionateWithFamily",
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
        weightKey: "energyWeight",
        subtraits: [
            {
                label: "How energetic should your ideal dog be?",
                key: "energyLevel",
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
        weightKey: "lengevityWeight",
        subtraits: [
            {
                label: "How long do you want your dog to live?",
                key: "longevity",
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
        weightKey: "foodCostWeight",
        subtraits: [
            {
                label: "How much can you afford for food annually?",
                key: "foodCost",
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

    /*const handleSave = () => {
        if (isSizeTrait) {
            updatePreferences({ size: answers['size'] });
        } else {
            const subtraits = traitData[typedTrait].subtraits;

            const reversedKeys = new Set(["sheddingLevel", "droolingLevel", "barkingLevel", "foodCost"]);

            // Define mappings from custom answer options to the standard scale
            const customMappings: Record<string, Record<string, string>> = {
                mentalSimulationNeeds: {
                    'Less than 1 hour': 'Very Low',
                    '1-3 hours': 'Low',
                    '3-5 hours': 'Moderate',
                    '5-8 hours': 'High',
                    'More than 8 hours': 'Very High',
                },
                // Add more mappings for other subtraits here as needed
            };

            const numericScores = subtraits.map(({ key }) => {
                const rawAnswer = answers[key];
                if (!rawAnswer) return 0;

                // Map to standard scale (Very Low - Very High)
                const mappedAnswer = customMappings[key]?.[rawAnswer] || rawAnswer;

                const scoreMap: Record<'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High', number> =
                    reversedKeys.has(key)
                        ? { 'Very Low': 5, 'Low': 4, 'Moderate': 3, 'High': 2, 'Very High': 1 }
                        : { 'Very Low': 1, 'Low': 2, 'Moderate': 3, 'High': 4, 'Very High': 5 };

                return scoreMap[mappedAnswer as keyof typeof scoreMap] || 0;

            });

            const maxScore = Math.max(...numericScores);

            let computedWeight = 1;
            if (maxScore >= 4) {
                computedWeight = 3;
            } else if (maxScore === 3) {
                computedWeight = 2;
            }

            updatePreferences({
                [traitData[typedTrait].weightKey]: computedWeight,
                ...subtraits.reduce((acc, sub) => {
                    acc[sub.key] = answers[sub.key];
                    return acc;
                }, {} as Record<string, string>),
            });
        }

        navigate('/toForm');
    };*/
    const handleSave = () => {
        if (isSizeTrait) {
            updatePreferences({ size: answers['size'] });
        } else {
            const subtraits = traitData[typedTrait].subtraits;

            const numericScores = subtraits.map(({ key, options }) => {
                const answer = answers[key];
                if (!answer || !options) return 0;

                const option = options.find(o => o.label === answer);
                return option?.score ?? 0;
            });

            const maxScore = Math.max(...numericScores);

            let computedWeight = 1;
            if (maxScore >= 4) {
                computedWeight = 3;
            } else if (maxScore === 3) {
                computedWeight = 2;
            }

            updatePreferences({
                [traitData[typedTrait].weightKey]: computedWeight,
                ...subtraits.reduce((acc, sub) => {
                    const answer = answers[sub.key];
                    const option = sub.options?.find((o) => o.label === answer);
                    acc[sub.key] = option?.score ?? 0; // ✅ store as number, not string
                    return acc;
                }, {} as Record<string, number>),
            });

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
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    maxWidth: '300px',
                                }}
                            >
                                <Typography variant="subtitle1" textAlign="center">
                                    {label}
                                </Typography>
                                <RadioGroup
                                    row
                                    value={answers[key] || ''}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    sx={{ justifyContent: 'center', mt: 1 }}
                                >
                                    {(options || []).map((opt) => (
                                        <FormControlLabel
                                            key={`${key}-${opt.label}`}
                                            value={opt.label}
                                            control={<Radio />}
                                            label={opt.label}
                                            labelPlacement="bottom"
                                        />
                                    ))}
                                </RadioGroup>
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
}

export default TraitPage;

