package com.example.demo.services;

import com.example.demo.dto.ShelterDTO;
import com.example.demo.enums.OperationType;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.observers.DogObserver;
import com.example.demo.repositories.ShelterRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ShelterService implements DogObserver {

    private final ShelterRepository shelterRepository;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository) {

        this.shelterRepository = shelterRepository;
    }

    @Transactional(readOnly = true)
    public ShelterDTO getShelterById(Long id) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }
        return MapperUtil.toShelterDTO(optionalShelter.get());
    }

    @Transactional(readOnly = true)
    public Shelter findShelterById(Long id) {
        return shelterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter with id " + id + " not found"));
    }


    /*public ShelterDTO getShelterByAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return shelterRepository.findAll().stream()
                .filter(s -> Objects.equals(s.getAdmin().getEmail(), email))
                .map(MapperUtil::toShelterDTO).findFirst().get();

    }*/

    @Transactional(readOnly = true)
    public List<ShelterDTO> getAllShelters() {
        List<Shelter> shelters = shelterRepository.findAll();

        //shelters.forEach(shelter -> shelter.getDogs().size());

        return shelters.stream().map(MapperUtil::toShelterDTO).toList();
    }

    @Transactional(readOnly = true)
    public ShelterDTO getUserShelter(User admin) {
        Shelter shelter = admin.getShelter();
        if (shelter == null) {
            return null;
        }
        return MapperUtil.toShelterDTO(shelter);
    }

    public ShelterDTO addShelter(ShelterDTO shelterDTO, User user) {
        shelterDTO.setAvailableDogs(shelterDTO.getDogs().size());
        shelterDTO.setTotalNumberOfDogs(shelterDTO.getDogs().size());
        Shelter shelter = MapperUtil.toShelter(shelterDTO, user);
        try {
            return MapperUtil.toShelterDTO(shelterRepository.save(shelter));
        } catch (IllegalArgumentException e) {
            throw new SaveInfoException("Error saving shelter");
        } catch (RuntimeException e) {
            throw new SaveInfoException("An unexpected error occurred while saving shelter");
        }
    }


    @Transactional
    public ShelterDTO updateShelter(Long id, ShelterDTO shelterDTO, User admin) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }

        Shelter shelter = optionalShelter.get();
        shelter.setName(shelterDTO.getName());
        shelter.setType(shelterDTO.getType());
        shelter.setEmail(shelterDTO.getEmail());
        shelter.setAddress(shelterDTO.getAddress());
        shelter.setCity(shelterDTO.getCity());
        shelter.setDescription(shelterDTO.getDescription());
        shelter.setAvailableDogs(shelterDTO.getAvailableDogs());
        shelter.setTotalNumberOfDogs(shelterDTO.getTotalNumberOfDogs());
        shelter.setPhoneNumber(shelterDTO.getPhoneNumber());

        if (shelterDTO.getImage1() != null) {
            String cleanedImage = shelterDTO.getImage1().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            shelter.setImage1(decodedImage);
        }

        if (shelterDTO.getImage2() != null) {
            String cleanedImage = shelterDTO.getImage2().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            shelter.setImage2(decodedImage);
        }

        return MapperUtil.toShelterDTO(shelterRepository.save(shelter));
    }


    public void deleteShelter(Long id, User user) {
        Optional<Shelter> optionalShelter = shelterRepository.findById(id);
        if (optionalShelter.isEmpty()) {
            throw new ResourceNotFoundException("Shelter with id " + id + " not found");
        }
        user.setShelter(null);
        shelterRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void onDogUpdated(Long shelterId, OperationType operation) {
        if (shelterRepository == null) {
            throw new IllegalStateException("❌ ShelterRepository is NULL when updating shelter!");
        }
        Shelter shelter = findShelterById(shelterId);
        if (!(operation == OperationType.DELETE && shelter.getDogs().isEmpty())) {
            shelter.setAvailableDogs(shelter.getAvailableDogs() + operation.getValue());
            shelter.setTotalNumberOfDogs(shelter.getTotalNumberOfDogs() + operation.getValue());
        } else {
            shelter.setAvailableDogs(0);
            shelter.setTotalNumberOfDogs(0);
        }
        shelterRepository.save(shelter);
    }
}
