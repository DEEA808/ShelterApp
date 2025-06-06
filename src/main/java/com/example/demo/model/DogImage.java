package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dog_images")
@Getter
@Setter
public class DogImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "position") // 2 or 3
    private int position;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dog_id")
    private Dog dog;
}


