package com.example.demo.controllers;

import com.example.demo.dto.DogDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Shelter;
import com.example.demo.services.DogService;
import com.example.demo.services.ShelterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RequestMapping("/dogs")
@RestController
public class DogController {
    private final DogService dogService;
    private final ShelterService shelterService;

    public DogController(DogService dogService, ShelterService shelterService) {
        this.dogService = dogService;
        this.shelterService = shelterService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<DogDTO>> getDogs() {
        try {
            List<DogDTO> dogs = dogService.getAllDogs();
            if (dogs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(dogs);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/myDogs/{id}")
    public ResponseEntity<List<DogDTO>> getMyDogs(@PathVariable Long id) {
        try {
            Shelter shelter = shelterService.findShelterById(id);
            List<DogDTO> dogs = dogService.getSheltersDogs(shelter);
            if (dogs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(dogs);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<DogDTO> getDogById(@PathVariable Long id) {
        try {
            DogDTO dogDTO = dogService.getDogById(id);
            return ResponseEntity.status(HttpStatus.OK).body(dogDTO);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add/{id}")
    public ResponseEntity<String> addDog(@PathVariable Long id, @RequestBody DogDTO dogDTO) {
        try {
            Shelter shelter = shelterService.findShelterById(id);
            return ResponseEntity.status(HttpStatus.CREATED).body("Dog with id " + dogService.addDog(dogDTO, shelter).getId().toString() + "added successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (SaveInfoException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("update/{id}/{idS}")
    public ResponseEntity<String> updateDog(@RequestBody DogDTO dogDTO, @PathVariable Long id, @PathVariable Long idS) {
        try {
            Shelter shelter = shelterService.findShelterById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Dog with id " + dogService.updateDog(id, dogDTO, shelter).getId().toString() + "was updated successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDog(@PathVariable Long id) {
        try {
            dogService.deleteDog(id);
            return ResponseEntity.status(HttpStatus.OK).body("Dog with id " + id + " was deleted successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}
