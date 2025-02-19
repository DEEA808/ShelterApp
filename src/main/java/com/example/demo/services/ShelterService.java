package com.example.demo.services;

import com.example.demo.dto.DogDTO;
import com.example.demo.dto.ShelterDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.repositories.ShelterRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ShelterService {
    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public ShelterDTO getShelterById(Long id) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }
        return MapperUtil.toShelterDTO(optionalShelter.get());
    }

    public Shelter findShelterById(Long id) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }
        return optionalShelter.get();
    }

    /*public ShelterDTO getShelterByAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return shelterRepository.findAll().stream()
                .filter(s -> Objects.equals(s.getAdmin().getEmail(), email))
                .map(MapperUtil::toShelterDTO).findFirst().get();

    }*/

    public List<ShelterDTO> getAllShelters() {
        List<Shelter> shelters = shelterRepository.findAll();
        return shelters.stream().map(MapperUtil::toShelterDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ShelterDTO> getUserShelters(User admin) {
        List<Shelter> shelters = Collections.singletonList(admin.getShelter());
        return shelters.stream().map(MapperUtil::toShelterDTO).toList();
    }

    public ShelterDTO addShelter(ShelterDTO shelterDTO, User user) {
        Shelter shelter = MapperUtil.toShelter(shelterDTO, user);
        try {
            return MapperUtil.toShelterDTO(shelterRepository.save(shelter));
        } catch (IllegalArgumentException e) {
            throw new SaveInfoException("Error saving shelter");
        } catch (RuntimeException e) {
            throw new SaveInfoException("An unexpected error occurred while saving shelter");
        }
    }


    public ShelterDTO updateShelter(Long id, ShelterDTO shelterDTO, User admin) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }

        Shelter shelter = optionalShelter.get();
        shelter.setName(shelterDTO.getName());
        shelter.setEmail(shelterDTO.getEmail());
        shelter.setAddress(shelterDTO.getAddress());
        shelter.setDescription(shelterDTO.getDescription());
        shelter.setAvailableDogs(shelterDTO.getAvailableDogs());
        shelter.setTotalNumberOfDogs(shelterDTO.getTotalNumberOfDogs());
        shelter.setPhoneNumber(shelterDTO.getPhoneNumber());

        if (shelterDTO.getImage() != null) {
            String cleanedImage = shelterDTO.getImage().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            shelter.setImage(decodedImage);
        }

        // ✅ Fix: Only set shelter if the admin doesn't already have one assigned
        if (admin.getShelter() == null || !admin.getShelter().getId().equals(shelter.getId())) {
            admin.setShelter(shelter);
        }

        return MapperUtil.toShelterDTO(shelterRepository.save(shelter));
    }


    public void deleteShelter(Long id,User user) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }
        user.setShelter(null);
        shelterRepository.deleteById(id);
    }

}
