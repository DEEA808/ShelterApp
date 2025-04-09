package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppointmentDTO {
    private Long id;
    private String userName;
    private String dogName;
    private String shelterName;
    private LocalDateTime dateTime;
    private Double price;
    private String status;
    private Long dogId;
    private Long shelterId;
    private Long userId;
}
