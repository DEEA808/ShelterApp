package com.example.demo.controllers;

import com.example.demo.dto.ShelterDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.User;
import com.example.demo.services.ShelterService;
import com.example.demo.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RequestMapping("/shelters")
@RestController
public class ShelterController {
    private final ShelterService shelterService;
    private final UserService userService;

    public ShelterController(ShelterService shelterService, UserService userService) {
        this.shelterService = shelterService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ShelterDTO>> getShelters() {
        try {
            List<ShelterDTO> shelters = shelterService.getAllShelters();
            if (shelters.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(shelters);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/mine")
    public ResponseEntity<ShelterDTO> getUsersShelters() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User admin = userService.findUserByEmail(email);
            ShelterDTO shelter = shelterService.getUserShelter(admin);
            if (shelter==null) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.status(HttpStatus.OK).body(shelter);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ShelterDTO> getShelterById(@PathVariable Long id) {
        try {
            ShelterDTO shelterDTO = shelterService.getShelterById(id);
            return ResponseEntity.status(HttpStatus.OK).body(shelterDTO);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addShelter(@RequestBody ShelterDTO shelterDTO) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User admin = userService.findUserByEmail(email);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Shelter with id " + shelterService.addShelter(shelterDTO, admin).getId().toString() + "added successfully");
        } catch (SaveInfoException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<String> updateShelter(@RequestBody ShelterDTO shelterDTO, @PathVariable Long id) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User admin = userService.findUserByEmail(email);
            return ResponseEntity.status(HttpStatus.OK).body("Shelter with id " + shelterService.updateShelter(id, shelterDTO, admin).getId().toString() + "was updated successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteShelter(@PathVariable Long id) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User admin = userService.findUserByEmail(email);
            shelterService.deleteShelter(id,admin);
            return ResponseEntity.status(HttpStatus.OK).body("Shelter with id " + id + " was deleted successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }


}
