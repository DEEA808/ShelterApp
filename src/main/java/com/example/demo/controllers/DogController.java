package com.example.demo.controllers;

import com.example.demo.dto.DogDTO;
import com.example.demo.dto.PreferencesAndResultsDTO;
import com.example.demo.dto.UserPreferencesDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.BreedScoreResult;
import com.example.demo.model.Shelter;
import com.example.demo.services.CsvService;
import com.example.demo.services.DogService;
import com.example.demo.services.ShelterService;
import com.example.demo.util.MapperUtil;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RequestMapping("/dogs")
@RestController
public class DogController {
    private final DogService dogService;
    private final ShelterService shelterService;
    private final CsvService csvService;

    public DogController(DogService dogService,ShelterService shelterService,CsvService csvService) {
        this.dogService = dogService;
        this.shelterService = shelterService;
        this.csvService = csvService;

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

    @GetMapping("/byBreed/{breed}")
    public ResponseEntity<List<DogDTO>> getDogsByBreed(@PathVariable String breed) {
        try{
            List<DogDTO> dogs=dogService.findDogByBreed(breed);
            if(dogs.isEmpty()){
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(dogs);
        }catch (RuntimeException e){
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

    @PostMapping("/upload/{id}")
    public ResponseEntity<String> uploadDog(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        List<DogDTO> dogs = csvService.parseCsvDogs(file).stream().map(MapperUtil::toDogDTO).toList();
        try {
            Shelter shelter = shelterService.findShelterById(id);
            int count = 0;
            for (DogDTO dogDTO : dogs) {
                dogService.addDog(dogDTO, shelter);
                count++;
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(count + " dogs added successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (SaveInfoException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }

    }

    @PutMapping("update/{id}/{idS}")
    public ResponseEntity<String> updateDog(@RequestBody DogDTO dogDTO, @PathVariable Long id, @PathVariable Long idS) {
        try {
            Shelter shelter = shelterService.findShelterById(idS);
            return ResponseEntity.status(HttpStatus.OK).body("Dog with id " + dogService.updateDog(id, dogDTO, shelter).getId().toString() + "was updated successfully");
        } catch (ResourceNotFoundException ex) {
            System.out.println("1");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}/{idS}")
    public ResponseEntity<String> deleteDog(@PathVariable Long id,@PathVariable Long idS) {
        try {
            dogService.deleteDog(id,idS);
            //shelterService.updateAvailableAndTotalNumberOfDogs(idS, OperationType.DELETE);
            return ResponseEntity.status(HttpStatus.OK).body("Dog with id " + id + " was deleted successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/perfectMatch")
    public ResponseEntity<List<BreedScoreResult>> getTop10BreedScoreResults(@RequestBody UserPreferencesDTO userPreferencesDTO) {
        try {
            List<BreedScoreResult> dogs = dogService.findBestMatchingDogs(userPreferencesDTO);
            if (dogs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(dogs);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/preferencesAndResults/{email}")
    public ResponseEntity<Object> receivePreferencesAndSendResults(@RequestBody PreferencesAndResultsDTO data, @PathVariable String email) {
        try {
            dogService.sendResultToEmail(email,data);
            return ResponseEntity.ok("Reset password completed");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password reset email sent unsuccessfully.");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
