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

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

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
    private byte[] image;

    @OneToMany(mappedBy = "shelter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Dog> dogs;


   /* @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;*/

}
