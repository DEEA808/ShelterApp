package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserPreferencesForEmailDTO {
    private String size;

    private int intelligenceWeight;
    private String trainabilityLevel;
    private String mentalSimulationNeeds;

    private int hygieneWeight;
    private String sheddingLevel;
    private String droolingLevel;

    private int friendlinessWeight;
    private String affectionateWithFamily;
    private String opennessToStrangers;
    private String playfulnessLevel;

    private int adaptabilityWeight;
    private String goodWithOtherDogs;
    private String goodWithChildren;

    private int energyWeight;
    private String energyLevel;
    private String barkingLevel;


    private int popularityWeight;
    private String popularity;

    private int lengevityWeight;
    private String longevity;

    private int foodCostWeight;
    private String foodCost;

}
