package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ShelterDTO {
    private Long id;
    private String name;
    private String type;
    private String description;
    private String address;
    private String city;
    private int totalNumberOfDogs;
    private int availableDogs;
    private String phoneNumber;
    private String email;
    private String image1;
    private String image2;
    private List<DogDTO> dogs;
}
