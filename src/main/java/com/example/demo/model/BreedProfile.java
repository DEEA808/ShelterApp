package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "breed_profile")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BreedProfile {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name="size")
    private String size;

    @Column(name = "affectionate_with_family")
    private int affectionateWithFamily;

    @Column(name = "good_with_children")
    private int goodWithChildren;

    @Column(name = "good_with_other_dogs")
    private int goodWithOtherDogs;

    @Column(name = "shedding_level")
    private int sheddingLevel;

    @Column(name = "drooling_level")
    private int droolingLevel;

    @Column(name = "openness_to_strangers")
    private int opennessToStrangers;

    @Column(name = "playfulness_level")
    private int playfulnessLevel;

    @Column(name = "trainability_level")
    private int trainabilityLevel;

    @Column(name = "energy_level")
    private int energyLevel;

    @Column(name = "barking_level")
    private int barkingLevel;

    @Column(name = "mental_stimulation_needs")
    private int mentalSimulationNeeds;

    @Column(name = "popularity")
    private int popularity;

    @Column(name = "longevity")
    private int longevity;

    @Column(name = "food_cost")
    private long foodCost;

    @Lob
    @Column(name = "image")
    @Basic(fetch = FetchType.EAGER)
    private byte[] imageAdult;


    @Lob
    @Column(name = "image_puppy")
    @Basic(fetch = FetchType.EAGER)
    private byte[] imagePuppy;
}
