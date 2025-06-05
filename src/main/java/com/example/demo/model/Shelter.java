package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "shelters")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Shelter {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

    @Column(name="city")
    private String city;

    @Column(name = "total_number_of_dogs")
    private int totalNumberOfDogs;

    @Column(name = "available_dogs")
    private int availableDogs;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

   /* //@Lob
    @Column(name="image",nullable = true, columnDefinition="clob")
    private byte[] image;*/

    @Lob
    @Column(name = "image", nullable = true)
    @Basic(fetch = FetchType.EAGER)
    private byte[] image1;

    @Lob
    @Column(name = "image_2", nullable = true)
    @Basic(fetch = FetchType.EAGER)
    private byte[] image2;

    @OneToMany(mappedBy = "shelter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Dog> dogs;

}
