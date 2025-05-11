package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DogDTO {
    private Long id;
    private String name;
    private String breed;
    private String description;
    private float age;
    private String story;
    private String gender;
    private String size;
    private String color;
    private String image;
    private String shelterName;
    private String shelterCity;
}
