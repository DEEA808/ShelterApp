package com.example.demo.services;

import com.example.demo.dto.DogDTO;
import com.example.demo.enums.OperationType;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.observers.DogObserver;
import com.example.demo.repositories.DogRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DogService {
    private final DogRepository dogRepository;
    private final DogObserver observer;


    public DogService(DogRepository dogRepository, DogObserver observer) {
        this.dogRepository = dogRepository;
        this.observer = observer;
    }

    /*private void notifyObserver(Long shelterId, OperationType operationType) {
        if (observer != null) {
            observer.onDogUpdated(shelterId, operationType);
        }
    }*/


    public DogDTO getDogById(Long id) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        return MapperUtil.toDogDTO(optionalDog.get());
    }

    @Transactional(readOnly = true)
    public List<DogDTO> getAllDogs() {
        List<Dog> dogs = dogRepository.findAll();
        return dogs.stream().map(MapperUtil::toDogDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<DogDTO> getSheltersDogs(Shelter shelter) {
        List<Dog> dogs = shelter.getDogs();
        return dogs.stream().map(MapperUtil::toDogDTO).toList();
    }

    @Transactional(readOnly = true)
    public Dog findDogById(Long id) {
        return dogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dog with id " + id + " not found"));
    }

    public DogDTO addDog(DogDTO dogDTO, Shelter shelter) {
        try {
            Dog dog = dogRepository.save(MapperUtil.toDog(dogDTO, shelter));
           // notifyObserver(dog.getId(), OperationType.ADD);
            return MapperUtil.toDogDTO(dog);
        } catch (IllegalArgumentException e) {
            throw new SaveInfoException("Error saving dog");
        } catch (RuntimeException e) {
            throw new SaveInfoException("An unexpected error occurred while saving dog");
        }
    }


    public DogDTO updateDog(Long id, DogDTO dogDTO, Shelter shelter) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        Dog dog = optionalDog.get();
        dog.setName(dogDTO.getName());
        dog.setAge(dogDTO.getAge());
        dog.setGender(dogDTO.getGender());
        dog.setDescription(dogDTO.getDescription());
        dog.setBreed(dogDTO.getBreed());
        dog.setStory(dogDTO.getStory());
        dog.setShelter(shelter);
        if (dogDTO.getImage() != null) {
            String cleanedImage = dogDTO.getImage().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            dog.setImage(decodedImage);
        }
        return MapperUtil.toDogDTO(dogRepository.save(dog));
    }

    public void deleteDog(Long id,Long shelterId) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        dogRepository.deleteById(id);
        //notifyObserver(shelterId, OperationType.DELETE);
    }
}
