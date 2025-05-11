package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "medical_files")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MedicalFile {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Lob
    @Column(name = "data", length = 1000000)
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "dog_id", nullable = false)
    private Dog dog;
}
