package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserPreferencesDTO {
    private String size;

    // Intelligence
    private int trainabilityLevel;
    private int trainabilityWeight;

    private int mentalSimulationNeeds;
    private int mentalSimulationNeedsWeight;

    // Hygiene
    private int sheddingLevel;
    private int sheddingWeight;

    private int droolingLevel;
    private int droolingWeight;

    // Friendliness
    private int affectionateWithFamily;
    private int affectionateWithFamilyWeight;

    private int opennessToStrangers;
    private int opennessToStrangersWeight;

    private int playfulnessLevel;
    private int playfulnessWeight;

    // Adaptability
    private int goodWithOtherDogs;
    private int goodWithOtherDogsWeight;

    private int goodWithChildren;
    private int goodWithChildrenWeight;

    // Energy
    private int energyLevel;
    private int energyWeight;

    private int barkingLevel;
    private int barkingWeight;

    // Longevity
    private int longevity;
    private int longevityWeight;

    // Food Cost
    private int foodCost;
    private int foodCostWeight;

    // Popularity (optional)
    private int popularity;
    private int popularityWeight;
}
