package com.example.demo.services;

import com.example.demo.dto.DogDTO;
import com.example.demo.dto.ShelterDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.repositories.DogRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DogService {
    private final DogRepository dogRepository;

    public DogService(DogRepository dogRepository) {
        this.dogRepository = dogRepository;
    }

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
        List<Dog> dogs=shelter.getDogs();
        return dogs.stream().map(MapperUtil::toDogDTO).toList();
    }

    public DogDTO addDog(DogDTO dogDTO, Shelter shelter) {
       Dog dog = MapperUtil.toDog(dogDTO, shelter);
       shelter.getDogs().add(dog);
        try {
            return MapperUtil.toDogDTO(dogRepository.save(dog));
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

    public void deleteDog(Long id) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        dogRepository.deleteById(id);
    }
}
