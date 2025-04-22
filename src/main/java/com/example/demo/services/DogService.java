package com.example.demo.services;

import com.example.demo.dto.DogDTO;
import com.example.demo.dto.UserPreferencesDTO;
import com.example.demo.enums.DogSize;
import com.example.demo.enums.OperationType;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.BreedProfile;
import com.example.demo.model.BreedScoreResult;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.observers.DogObserver;
import com.example.demo.repositories.BreedProfileRepository;
import com.example.demo.repositories.DogRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DogService {
    private final DogRepository dogRepository;
    private final List<DogObserver> observers = new ArrayList<>();
    private final BreedProfileRepository breedProfileRepository;


    @Autowired
    public DogService(DogRepository dogRepository, BreedProfileRepository breedProfileRepository) {
        this.dogRepository = dogRepository;
        this.breedProfileRepository = breedProfileRepository;
    }

    private void notifyObserver(Long shelterId, OperationType operationType) {
        for (DogObserver observer : observers) {
            observer.onDogUpdated(shelterId, operationType);
        }
    }

    public void addObserver(DogObserver observer) {
        observers.add(observer);
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
        List<Dog> dogs = shelter.getDogs();
        return dogs.stream().map(MapperUtil::toDogDTO).toList();
    }

    @Transactional(readOnly = true)
    public Dog findDogById(Long id) {
        return dogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dog with id " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<DogDTO> findDogByBreed(String breed) {
        List<Dog> dogs=dogRepository.findByBreed(breed);
        return dogs.stream().map(MapperUtil::toDogDTO).toList();
    }

    public DogDTO addDog(DogDTO dogDTO, Shelter shelter) {
        try {
            Dog dog = dogRepository.save(MapperUtil.toDog(dogDTO, shelter));
            notifyObserver(shelter.getId(), OperationType.ADD);
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
        if (dogDTO.getSize() != null) {
            dog.setSize(DogSize.valueOf(dogDTO.getSize().toUpperCase()));
        }
        dog.setColor(dogDTO.getColor().toLowerCase());
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

    public void deleteDog(Long id, Long shelterId) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        dogRepository.deleteById(id);
        notifyObserver(shelterId, OperationType.DELETE);
    }

    public List<BreedScoreResult> findBestMatchingDogs(UserPreferencesDTO userPref) {
        List<BreedProfile> allBreeds = breedProfileRepository.findAll();
        List<BreedProfile> toSearchInForBreeds = allBreeds;
        String size = userPref.getSize();
        System.out.println(size);
        if (!size.equalsIgnoreCase("any")) {
            toSearchInForBreeds = allBreeds.stream()
                    .filter(b -> b.getSize().equalsIgnoreCase(size)).toList();
        }

        return toSearchInForBreeds.stream()
                .map(breed -> {
                    int score = calculateScore(userPref, breed);
                    return new BreedScoreResult(breed, score);
                })
                .sorted(Comparator.comparingInt(BreedScoreResult::getScore).reversed())
                .limit(10)
                .toList();
    }

    private int calculateScore(UserPreferencesDTO pref, BreedProfile breed) {
        int score = 0;

        score += pref.getIntelligenceWeight() * ((3 - Math.abs(pref.getTrainabilityLevel() - breed.getTrainabilityLevel())) + (3 - Math.abs(pref.getMentalSimulationNeeds() - breed.getMentalSimulationNeeds())));
        score += pref.getHygieneWeight() * ((3 - Math.abs(pref.getSheddingLevel() - breed.getSheddingLevel())) + (3 - Math.abs(pref.getDroolingLevel() - breed.getDroolingLevel())));
        score += pref.getAdaptabilityWeight() * ((3 - Math.abs(pref.getGoodWithOtherDogs() - breed.getGoodWithOtherDogs())) + (3 - Math.abs(pref.getGoodWithChildren() - breed.getGoodWithChildren())));
        score += pref.getEnergyWeight() * ((3 - Math.abs(pref.getEnergyLevel() - breed.getEnergyLevel())) + (3 - Math.abs(pref.getBarkingLevel() - breed.getBarkingLevel())));
        score += pref.getFriendlinessWeight() * ((3 - Math.abs(pref.getAffectionateWithFamily() - breed.getAffectionateWithFamily())) + (3 - Math.abs(pref.getOpennessToStrangers() - breed.getOpennessToStrangers())) + (3 - Math.abs(pref.getPlayfulnessLevel() - breed.getPlayfulnessLevel())));
        score += pref.getPopularityWeight() * (3 - Math.abs(pref.getPopularity()) - breed.getPopularity());
        score += 0 * (3 - Math.abs(pref.getLongevity() - breed.getLongevity()));
        score += 0 * (3 - Math.abs(pref.getFoodCost() - breed.getFoodCost()));

        return score;
    }
}
