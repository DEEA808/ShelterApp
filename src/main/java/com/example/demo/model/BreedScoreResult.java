package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BreedScoreResult {
    private BreedProfile breedProfile;
    private double compatibiltyPercent;
    private String image;
}
