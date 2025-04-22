package com.example.demo.services;

import com.example.demo.model.BreedProfile;
import com.example.demo.model.Dog;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;

@Service
public class CsvService {

    public static List<BreedProfile> parseCsvBreedProfile(InputStream inputStream) {
        List<BreedProfile> breedProfiles = new ArrayList<>();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
            CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader());

            for (CSVRecord csvRecord : csvParser) {
                BreedProfile breedProfile = new BreedProfile();
                breedProfile.setName(csvRecord.get(0));
                breedProfile.setSize(csvRecord.get(1));
                breedProfile.setLongevity(Integer.parseInt(csvRecord.get(2)));
                breedProfile.setAffectionateWithFamily(Integer.parseInt(csvRecord.get(3)));
                breedProfile.setGoodWithChildren(Integer.parseInt(csvRecord.get(4)));
                breedProfile.setGoodWithOtherDogs(Integer.parseInt(csvRecord.get(5)));
                breedProfile.setSheddingLevel(Integer.parseInt(csvRecord.get(6)));
                breedProfile.setDroolingLevel(Integer.parseInt(csvRecord.get(7)));
                breedProfile.setOpennessToStrangers(Integer.parseInt(csvRecord.get(8)));
                breedProfile.setPlayfulnessLevel(Integer.parseInt(csvRecord.get(9)));
                breedProfile.setTrainabilityLevel(Integer.parseInt(csvRecord.get(10)));
                breedProfile.setEnergyLevel(Integer.parseInt(csvRecord.get(11)));
                breedProfile.setBarkingLevel(Integer.parseInt(csvRecord.get(12)));
                breedProfile.setMentalSimulationNeeds(Integer.parseInt(csvRecord.get(13)));
                breedProfile.setPopularity(Integer.parseInt(csvRecord.get(14)));
                breedProfile.setFoodCost(Integer.parseInt(csvRecord.get(15)));
                breedProfiles.add(breedProfile);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse csv file: " + e.getMessage());
        }
        return breedProfiles;
    }

    public List<Dog> parseCsvDogs(MultipartFile file) {
        List<Dog> dogs = new ArrayList<>();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(),
                    StandardCharsets.UTF_8));
            CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader());

            for (CSVRecord csvRecord : csvParser) {
                Dog dog = new Dog();
                dog.setName(csvRecord.get(0));
                dog.setBreed(csvRecord.get(1));
                dog.setDescription(csvRecord.get(2));
                dog.setAge(Integer.parseInt(csvRecord.get(3)));
                dog.setStory(csvRecord.get(4));
                dog.setGender(csvRecord.get(5));
                if (csvRecord.get(6) != null) {
                    String cleanedImage = csvRecord.get(6).replaceAll("[\\n\\r]", "").trim();
                    byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
                    System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
                    dog.setImage(decodedImage);
                }
                dogs.add(dog);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse csv file: " + e.getMessage());
        }
        return dogs;
    }
}
