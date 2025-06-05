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
                breedProfile.setAffectionateWithFamily(Integer.parseInt(csvRecord.get(0)));
                breedProfile.setBarkingLevel(Integer.parseInt(csvRecord.get(1)));
                breedProfile.setDroolingLevel(Integer.parseInt(csvRecord.get(2)));
                breedProfile.setEnergyLevel(Integer.parseInt(csvRecord.get(3)));
                breedProfile.setFoodCost(Integer.parseInt(csvRecord.get(4)));
                breedProfile.setGoodWithChildren(Integer.parseInt(csvRecord.get(5)));
                breedProfile.setGoodWithOtherDogs(Integer.parseInt(csvRecord.get(6)));
                breedProfile.setLongevity(Integer.parseInt(csvRecord.get(7)));
                breedProfile.setMentalSimulationNeeds(Integer.parseInt(csvRecord.get(8)));
                breedProfile.setName(csvRecord.get(9));
                breedProfile.setOpennessToStrangers(Integer.parseInt(csvRecord.get(10)));
                breedProfile.setPlayfulnessLevel(Integer.parseInt(csvRecord.get(11)));
                breedProfile.setPopularity(Integer.parseInt(csvRecord.get(12)));
                breedProfile.setSheddingLevel(Integer.parseInt(csvRecord.get(13)));
                breedProfile.setTrainabilityLevel(Integer.parseInt(csvRecord.get(14)));
                breedProfile.setSize(csvRecord.get(15));

                String imageAdult=csvRecord.get(16);
                String imagePup=csvRecord.get(17);
                if (imageAdult != null) {
                    String cleanedImage = imageAdult.replaceAll("[\\n\\r]", "").trim();
                    byte[] decodedImageAd = Base64.getDecoder().decode(cleanedImage);
                    breedProfile.setImageAdult(decodedImageAd);
                }

                if (imagePup != null) {
                    String cleanedImage = imagePup.replaceAll("[\\n\\r]", "").trim();
                    byte[] decodedImagePup = Base64.getDecoder().decode(cleanedImage);
                    breedProfile.setImagePuppy(decodedImagePup);
                }

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
                dog.setAge(Float.parseFloat(csvRecord.get(3)));
                dog.setStory(csvRecord.get(4));
                dog.setGender(csvRecord.get(5));
                if (csvRecord.get(6) != null) {
                    String cleanedImage = csvRecord.get(6).replaceAll("[\\n\\r]", "").trim();
                    byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
                    System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
                    dog.setImage1(decodedImage);
                }
                if (csvRecord.get(7) != null) {
                    String cleanedImage = csvRecord.get(7).replaceAll("[\\n\\r]", "").trim();
                    byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
                    System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
                    dog.setImage2(decodedImage);
                }
                if (csvRecord.get(8) != null) {
                    String cleanedImage = csvRecord.get(8).replaceAll("[\\n\\r]", "").trim();
                    byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
                    System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
                    dog.setImage3(decodedImage);
                }
                dogs.add(dog);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse csv file: " + e.getMessage());
        }
        return dogs;
    }
}
