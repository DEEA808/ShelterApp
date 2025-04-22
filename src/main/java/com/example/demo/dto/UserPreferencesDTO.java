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

    private int intelligenceWeight;
    private int trainabilityLevel;
    private int mentalSimulationNeeds;

    private int hygieneWeight;
    private int sheddingLevel;
    private int droolingLevel;

    private int friendlinessWeight;
    private int affectionateWithFamily;
    private int opennessToStrangers;
    private int playfulnessLevel;

    private int adaptabilityWeight;
    private int goodWithOtherDogs;
    private int goodWithChildren;

    private int energyWeight;
    private int energyLevel;
    private int barkingLevel;


    private int popularityWeight;
    private int popularity;

    private int lengevityWeight;
    private int longevity;

    private int foodCostWeight;
    private int foodCost;

}
