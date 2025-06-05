package com.example.demo.model;

import com.example.demo.enums.DogSize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "dogs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Dog {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "breed")
    private String breed;

    @Column(name = "description")
    private String description;

    @Column(name = "age")
    private float age;

    @Column(name = "story")
    private String story;

    @Column(name = "gender")
    private String gender;

    @Column(name = "size")
    private DogSize size;

    @Column(name = "color")
    private String color;

    @Lob
    @Column(name = "image")
    @Basic(fetch = FetchType.LAZY)
    private byte[] image1;

    @Lob
    @Column(name = "image_2")
    @Basic(fetch = FetchType.LAZY)
    private byte[] image2;

    @Lob
    @Column(name = "image_3")
    @Basic(fetch = FetchType.LAZY)
    private byte[] image3;

    @ManyToOne
    @JoinColumn(name = "shelter_id", nullable = false)
    private Shelter shelter;

    @OneToMany(mappedBy = "dog", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalFile> medicalFiles;

    @ManyToMany(mappedBy = "favoriteDogs",fetch = FetchType.LAZY)
    private Set<User> favoritedByUsers = new HashSet<>();


}
