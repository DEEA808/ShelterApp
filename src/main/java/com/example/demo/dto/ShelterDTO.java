package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ShelterDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private int totalNumberOfDogs;
    private int availableDogs;
    private String phoneNumber;
    private String email;
    private String image;
}
