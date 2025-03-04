package com.example.demo.services;

import com.example.demo.model.Dog;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;

@Service
public class CsvService {
    public List<Dog> parseCsv(MultipartFile file) {
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
