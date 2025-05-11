package com.example.demo.services;

import com.example.demo.dto.MedicalFileDTO;
import com.example.demo.enums.OperationType;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.Dog;
import com.example.demo.model.MedicalFile;
import com.example.demo.repositories.DogRepository;
import com.example.demo.repositories.MedicalFileRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalFileService {
    private final MedicalFileRepository medicalFileRepository;
    private final DogRepository dogRepository;

    public MedicalFileService(MedicalFileRepository medicalFileRepository, DogRepository dogRepository) {
        this.medicalFileRepository = medicalFileRepository;
        this.dogRepository = dogRepository;
    }

    public void uploadMedicalFile(Long id, MultipartFile[] files) {
        Dog dog = dogRepository.findById(id).get();

        for (MultipartFile file : files) {
            try {
                MedicalFile medicalFile = new MedicalFile();
                medicalFile.setDog(dog);
                medicalFile.setFileType(file.getContentType());
                medicalFile.setFileName(file.getOriginalFilename());
                medicalFile.setData(file.getBytes());
                medicalFileRepository.save(medicalFile);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<MedicalFileDTO> getAllMedicalFiles(Long id) {
        Dog dog = dogRepository.findById(id).get();
        List<MedicalFile> files=dog.getMedicalFiles();

        return files.stream().map(MapperUtil::toMedicalFileDTO).toList();
    }

    public void deleteFile(Long id) {
        Optional<MedicalFile> optionalFile = medicalFileRepository.findById(id);
        if (optionalFile.isEmpty()) {
            throw new ResourceNotFoundException("File with id " + id + " not found");
        }
        medicalFileRepository.deleteById(id);
    }
}
