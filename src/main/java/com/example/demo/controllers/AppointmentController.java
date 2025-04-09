package com.example.demo.controllers;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.services.AppointmentService;
import com.example.demo.services.DogService;
import com.example.demo.services.ShelterService;
import com.example.demo.services.UserService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RequestMapping("/appointments")
@RestController
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final ShelterService shelterService;
    private final DogService dogService;
    private final UserService userService;

    public AppointmentController(AppointmentService appointmentService, ShelterService shelterService, DogService dogService, UserService userService) {
        this.appointmentService = appointmentService;
        this.shelterService = shelterService;
        this.dogService = dogService;
        this.userService = userService;
        System.out.println("✅ DogService initialized");
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        try {
            List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
            if (appointments.isEmpty())
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            return ResponseEntity.status(HttpStatus.OK).body(appointments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/mine")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments() {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<AppointmentDTO> appointmentDTOS = appointmentService.getAppointmentsByUserId(user.getId());
            if (appointmentDTOS.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(appointmentDTOS);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findUserByEmail(email);
            Shelter shelter = shelterService.findShelterById(appointmentDTO.getShelterId());
            Dog dog = dogService.findDogById(appointmentDTO.getDogId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Appointment with id " + appointmentService.createAppointment(appointmentDTO, dog, shelter, user).getId() + " created succesfully!");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (SaveInfoException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (RuntimeException | MessagingException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        try {
            AppointmentDTO appointmentDTO = appointmentService.getAppointmentById(id);
            return ResponseEntity.status(HttpStatus.OK).body(appointmentDTO);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentService.cancelAppointment(id);
            return ResponseEntity.status(HttpStatus.OK).body("Appointment with id " + id + " was canceled");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}
