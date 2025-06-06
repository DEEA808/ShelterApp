package com.example.demo.services;

import com.example.demo.dto.*;
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
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DogService {
    private final DogRepository dogRepository;
    private final List<DogObserver> observers = new ArrayList<>();
    private final BreedProfileRepository breedProfileRepository;

    @Autowired
    private JavaMailSender mailSender;


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

    @Transactional
    public DogDTO getDogById(Long id) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        return MapperUtil.toDogDTOForProfile(optionalDog.get());
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

    public Dog findDogById(Long id) {
        return dogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dog with id " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<DogDTO> findDogByBreed(String breed) {
        List<Dog> dogs = dogRepository.findByBreedContainingIgnoreCase(breed);
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


    @Transactional
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
        if (dogDTO.getImage1() != null) {
            String cleanedImage = dogDTO.getImage1().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            dog.setImage1(decodedImage);
        }
       /* if (dogDTO.getImage2() != null) {
            String cleanedImage = dogDTO.getImage2().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            dog.setImage2(decodedImage);
        }
        if (dogDTO.getImage3() != null) {
            String cleanedImage = dogDTO.getImage3().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            dog.setImage3(decodedImage);
        }*/
        return MapperUtil.toDogDTOForProfile(dogRepository.save(dog));
    }

    public void deleteDog(Long id, Long shelterId) {
        Optional<Dog> optionalDog = dogRepository.findById(id);
        if (optionalDog.isEmpty()) {
            throw new ResourceNotFoundException("Dog with id " + id + " not found");
        }
        dogRepository.deleteById(id);
        notifyObserver(shelterId, OperationType.DELETE);
    }

    /*public List<BreedScoreResult> findBestMatchingDogs(UserPreferencesDTO userPref) {
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
                .sorted(Comparator.comparingDouble(BreedScoreResult::getCompatibiltyPercent).reversed())
                .limit(10)
                .toList();
    }*/

    public List<BreedScoreResult> findBestMatchingDogs(UserPreferencesDTO userPref) {
        List<BreedProfile> allBreeds = breedProfileRepository.findAll();
        List<BreedProfile> toSearchInForBreeds = breedProfileRepository.findAll();
        String size = userPref.getSize();
        if (!size.equalsIgnoreCase("doesn't matter")) {
            toSearchInForBreeds = allBreeds.stream()
                    .filter(b -> b.getSize().equalsIgnoreCase(size)).toList();
        }

        int maxPossibleScore = calculateMaxPossibleScore(userPref);

        return toSearchInForBreeds.stream()
                .map(breed -> {
                    int score = calculateScore(userPref, breed);
                    double compatibilityPercent = maxPossibleScore > 0
                            ? (double) score / maxPossibleScore * 100
                            : 0;
                    String base64Image = "";
                    if (breed.getImageAdult() != null) {
                        base64Image = Base64.getEncoder().encodeToString(breed.getImageAdult());
                    }
                    double roundedPercent = Math.round(compatibilityPercent * 10.0) / 10.0;
                    return new BreedScoreResult(breed, roundedPercent, base64Image);
                })
                .sorted(Comparator.comparingDouble(BreedScoreResult::getCompatibiltyPercent).reversed())
                .limit(10)
                .toList();
    }


    private int calculateMaxPossibleScore(UserPreferencesDTO pref) {
        return
                pref.getTrainabilityWeight() * 5 +
                        pref.getMentalSimulationNeedsWeight() * 5 +
                        pref.getSheddingWeight() * 5 +
                        pref.getDroolingWeight() * 5 +
                        pref.getAffectionateWithFamilyWeight() * 5 +
                        pref.getOpennessToStrangersWeight() * 5 +
                        pref.getPlayfulnessWeight() * 5 +
                        pref.getGoodWithOtherDogsWeight() * 5 +
                        pref.getGoodWithChildrenWeight() * 5 +
                        pref.getEnergyWeight() * 5 +
                        pref.getBarkingWeight() * 5 +
                        pref.getLongevityWeight() * 5 +
                        pref.getFoodCostWeight() * 5 +
                        pref.getPopularityWeight() * 5;
    }


    private int calculateScore(UserPreferencesDTO pref, BreedProfile breed) {
        int score = 0;

        // 🧠 Intelligence
        score += pref.getTrainabilityWeight() * (5 - Math.abs(pref.getTrainabilityLevel() - breed.getTrainabilityLevel()));
        score += pref.getMentalSimulationNeedsWeight() * (5 - Math.abs(pref.getMentalSimulationNeeds() - breed.getMentalSimulationNeeds()));

        // 🧼 Hygiene
        score += pref.getSheddingWeight() * (5 - Math.abs(pref.getSheddingLevel() - breed.getSheddingLevel()));
        System.out.println(pref.getSheddingLevel());
        score += pref.getDroolingWeight() * (5 - Math.abs(pref.getDroolingLevel() - breed.getDroolingLevel()));

        // 😊 Friendliness
        score += pref.getAffectionateWithFamilyWeight() * (5 - Math.abs(pref.getAffectionateWithFamily() - breed.getAffectionateWithFamily()));
        score += pref.getOpennessToStrangersWeight() * (5 - Math.abs(pref.getOpennessToStrangers() - breed.getOpennessToStrangers()));
        score += pref.getPlayfulnessWeight() * (5 - Math.abs(pref.getPlayfulnessLevel() - breed.getPlayfulnessLevel()));

        // 🧒 Adaptability
        score += pref.getGoodWithOtherDogsWeight() * (5 - Math.abs(pref.getGoodWithOtherDogs() - breed.getGoodWithOtherDogs()));
        score += pref.getGoodWithChildrenWeight() * (5 - Math.abs(pref.getGoodWithChildren() - breed.getGoodWithChildren()));

        // ⚡ Energy
        score += pref.getEnergyWeight() * (5 - Math.abs(pref.getEnergyLevel() - breed.getEnergyLevel()));
        score += pref.getBarkingWeight() * (5 - Math.abs(pref.getBarkingLevel() - breed.getBarkingLevel()));

        // 🕒 Longevity
        score += pref.getLongevityWeight() * (5 - Math.abs(pref.getLongevity() - breed.getLongevity()));

        // 💰 Food Cost
        score += (int) (pref.getFoodCostWeight() * (5 - Math.abs(pref.getFoodCost() - breed.getFoodCost())));

        // ⭐ Popularity (optional)
        if (pref.getPopularityWeight() > 0) {
            score += pref.getPopularityWeight() * (5 - Math.abs(pref.getPopularity() - breed.getPopularity()));
        }
        System.out.println(score);
        return score;
    }


    public void sendResultToEmail(String email, PreferencesAndResultsDTO data) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("Your perfect dog results");

        StringBuilder htmlContent = new StringBuilder();

        htmlContent.append("<html><body>");
        htmlContent.append("<h2 style='color:#D86B5C;'>🐶 Your Top 10 Dog Matches</h2>");
        htmlContent.append("<p>Based on your preferences, here are the top breeds for you:</p>");

        htmlContent.append("<ul>");
        for (BreedScoreResult result : data.getResults()) {
            htmlContent.append("<li><strong>")
                    .append(result.getBreedProfile().getName())
                    .append("</strong> - Score: ")
                    .append(result.getCompatibiltyPercent())
                    .append("%")
                    .append("</li>");
        }
        htmlContent.append("</ul>");

        htmlContent.append("<hr style='margin: 20px 0;'/>");

        htmlContent.append("<h3 style='color:#D86B5C;'>📋 Your Preferences</h3>");
        htmlContent.append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse;'>");

        UserPreferencesForEmailDTO prefs = data.getPreferences();
        //htmlContent.append("<tr><td><strong>Intelligence Weight</strong></td><td>").append(prefs.getIntelligenceWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Size</td><td>").append(prefs.getSize()).append("</td></tr>");
        htmlContent.append("<tr><td>Trainability Level</td><td>").append(prefs.getTrainabilityLevel()).append("</td></tr>");
        htmlContent.append("<tr><td>Mental Simulation Needs</td><td>").append(prefs.getMentalSimulationNeeds()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Hygiene Weight</strong></td><td>").append(prefs.getHygieneWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Shedding Level</td><td>").append(prefs.getSheddingLevel()).append("</td></tr>");
        htmlContent.append("<tr><td>Drooling Level</td><td>").append(prefs.getDroolingLevel()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Friendliness Weight</strong></td><td>").append(prefs.getFriendlinessWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Affectionate with Family</td><td>").append(prefs.getAffectionateWithFamily()).append("</td></tr>");
        htmlContent.append("<tr><td>Openness to strangers</td><td>").append(prefs.getOpennessToStrangers()).append("</td></tr>");
        htmlContent.append("<tr><td>Playfulness Level</td><td>").append(prefs.getPlayfulnessLevel()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Adaptability Weight</strong></td><td>").append(prefs.getAdaptabilityWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Good With Other Dogs</td><td>").append(prefs.getGoodWithOtherDogs()).append("</td></tr>");
        htmlContent.append("<tr><td>Good With Children</td><td>").append(prefs.getGoodWithChildren()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Energy Weight</strong></td><td>").append(prefs.getEnergyWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Energy Level</td><td>").append(prefs.getEnergyLevel()).append("</td></tr>");
        htmlContent.append("<tr><td>Barking Level</td><td>").append(prefs.getBarkingLevel()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Popularity Weight</strong></td><td>").append(prefs.getPopularityWeight()).append("</td></tr>");
        //htmlContent.append("<tr><td>Popularity</td><td>").append(prefs.getPopularity()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Longevity Weight</strong></td><td>").append(prefs.getLengevityWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Longevity</td><td>").append(prefs.getLongevity()).append("</td></tr>");

        //htmlContent.append("<tr><td><strong>Food Cost Weight</strong></td><td>").append(prefs.getFoodCostWeight()).append("</td></tr>");
        htmlContent.append("<tr><td>Food Cost</td><td>").append(prefs.getFoodCost()).append("</td></tr>");

        htmlContent.append("</table>");

        htmlContent.append("<p style='margin-top:20px;'>🐾 Thank you for using Find Your Perfect Dog!</p>");
        htmlContent.append("</body></html>");

        helper.setText(htmlContent.toString(), true);

        mailSender.send(message);
    }
}
