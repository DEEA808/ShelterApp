package com.example.demo.controllers;


import com.example.demo.dto.MedicalFileDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.services.MedicalFileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RequestMapping("/files")
@RestController
public class MedicalFileController {
    private final MedicalFileService medicalFileService;

    public MedicalFileController(MedicalFileService medicalFileService) {
        this.medicalFileService = medicalFileService;
    }

    @PostMapping("/uploadFiles/{id}")
    public ResponseEntity<String> uploadFile(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        try {
            medicalFileService.uploadMedicalFile(id, files);
            return ResponseEntity.status(HttpStatus.CREATED).body("File uploaded successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload files: " + e.getMessage());
        }
    }

    @GetMapping("/myFiles/{id}")
    public ResponseEntity<List<MedicalFileDTO>> getAllFiles(@PathVariable Long id) {
        try {
            List<MedicalFileDTO> files = medicalFileService.getAllMedicalFiles(id);
            if (files.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            return ResponseEntity.status(HttpStatus.OK).body(files);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDog(@PathVariable Long id) {
        try {
            medicalFileService.deleteFile(id);
            return ResponseEntity.status(HttpStatus.OK).body("File with id " + id + " was deleted successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}
