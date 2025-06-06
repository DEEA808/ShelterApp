package com.example.demo.services;

import com.example.demo.model.Dog;
import com.example.demo.model.DogImage;
import com.example.demo.repositories.DogImageRepository;
import com.example.demo.repositories.DogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class DogImagesService {
    private final DogRepository dogRepository;
    private final DogImageRepository dogImageRepository;

    @Autowired
    public DogImagesService(DogRepository dogRepository, DogImageRepository dogImageRepository) {
        this.dogRepository = dogRepository;
        this.dogImageRepository = dogImageRepository;
    }

   /* @Transactional
    public void saveOrUpdateImages(Long dogId, List<MultipartFile> images) {
        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(() -> new RuntimeException("Dog not found"));

        // Delete existing images
        dogImageRepository.deleteByDogId(dogId);
        dog.getExtraImages().clear(); // important for in-memory consistency

        int position = 2;
        for (MultipartFile file : images) {
            try {
                DogImage dogImage = new DogImage();
                dogImage.setDog(dog);
                dogImage.setImageData(file.getBytes());
                dogImage.setPosition(position++);

                dog.getExtraImages().add(dogImage); // this links them on both sides
            } catch (IOException e) {
                throw new RuntimeException("Could not save image", e);
            }
        }

        // Save the dog to persist new images via cascade
        dogRepository.save(dog);
    }*/
   /*@Transactional
   public void saveSingleBase64Image(Long dogId, String base64Image, int position) {
       Dog dog = dogRepository.findById(dogId)
               .orElseThrow(() -> new RuntimeException("Dog not found"));

       byte[] imageBytes = Base64.getDecoder().decode(base64Image);

       // Try to find existing image at this position
       Optional<DogImage> existingImageOpt = dog.getExtraImages().stream()
               .filter(img -> img.getPosition() == position)
               .findFirst();

       if (existingImageOpt.isPresent()) {
           // UPDATE existing image
           DogImage existingImage = existingImageOpt.get();
           existingImage.setImageData(imageBytes);
           existingImage.setDog(dog);
           dogImageRepository.save(existingImage);
       } else {
           // CREATE new image
           DogImage newImage = new DogImage();
           newImage.setDog(dog);
           newImage.setPosition(position);
           newImage.setImageData(imageBytes);
           dog.getExtraImages().add(newImage);  // keep relationship consistent
           dogImageRepository.save(newImage);
       }

       dogRepository.save(dog); // Optional but safe for syncing persistence context
   }*/

    @Transactional
    public void saveSingleBase64Image(Long dogId, String base64Image, int position) {
        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(() -> new RuntimeException("Dog not found"));

        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        DogImage image = dog.getExtraImages().stream()
                .filter(img -> img.getPosition() == position)
                .findFirst()
                .orElseGet(() -> {
                    DogImage newImg = new DogImage();
                    newImg.setDog(dog);
                    newImg.setPosition(position);
                    return newImg;
                });

        image.setImageData(imageBytes);
        dogImageRepository.save(image);
    }





}
