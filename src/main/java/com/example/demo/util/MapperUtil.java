package com.example.demo.util;

import com.example.demo.dto.*;
import com.example.demo.enums.DogSize;
import com.example.demo.model.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

public class MapperUtil {

    public static Shelter toShelter(ShelterDTO shelterDTO, User admin) {
        Shelter shelter = new Shelter();
        shelter.setId(shelterDTO.getId());
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
        List<Dog> shelters = shelterDTO.getDogs().stream()
                .map(d -> MapperUtil.toDog(d, shelter))
                .toList();
        shelter.setDogs(shelters);
        admin.setShelter(shelter);
        return shelter;
    }

    public static DogDTO toDogDTOForProfile(Dog dog) {
        DogDTO dogDTO = new DogDTO();

        String base64Image1 = "";
        if (dog.getImage1() != null) {
            base64Image1 = Base64.getEncoder().encodeToString(dog.getImage1());
        }
        dogDTO.setId(dog.getId());
        dogDTO.setName(dog.getName());
        dogDTO.setDescription(dog.getDescription());
        dogDTO.setAge((float)(Math.round(dog.getAge() * 10.0) / 10.0));
        dogDTO.setGender(dog.getGender());
        if (dog.getSize() != null) {
            dogDTO.setSize(dog.getSize().getDisplayName());
        }
        dogDTO.setColor(dog.getColor());
        dogDTO.setBreed(dog.getBreed());
        dogDTO.setStory(dog.getStory());
        dogDTO.setImage1(base64Image1);
        dogDTO.setShelterName(dog.getShelter().getName());
        dogDTO.setShelterCity(dog.getShelter().getCity());

        List<DogImage> extraImages = dog.getExtraImages();
        String base64Image2 = "", base64Image3 = "";

        for (DogImage img : extraImages) {
            String base64 = Base64.getEncoder().encodeToString(img.getImageData());
            if (img.getPosition() == 2) base64Image2 = base64;
            if (img.getPosition() == 3) base64Image3 = base64;
        }
        dogDTO.setImage2(base64Image2);
        dogDTO.setImage3(base64Image3);

        return dogDTO;
    }

    public static DogDTO toDogDTO(Dog dog) {
        DogDTO dogDTO = new DogDTO();

        String base64Image1 = "";
        if (dog.getImage1() != null) {
            base64Image1 = Base64.getEncoder().encodeToString(dog.getImage1());
        }

       /* String base64Image2 = "";
        if (dog.getImage2() != null) {
            base64Image2 = Base64.getEncoder().encodeToString(dog.getImage2());
        }

        String base64Image3 = "";
        if (dog.getImage3() != null) {
            base64Image3 = Base64.getEncoder().encodeToString(dog.getImage3());
        }*/

        dogDTO.setId(dog.getId());
        dogDTO.setName(dog.getName());
        dogDTO.setDescription(dog.getDescription());
        dogDTO.setAge((float)(Math.round(dog.getAge() * 10.0) / 10.0));
        dogDTO.setGender(dog.getGender());
        if (dog.getSize() != null) {
            dogDTO.setSize(dog.getSize().getDisplayName());
        }
        dogDTO.setColor(dog.getColor());
        dogDTO.setBreed(dog.getBreed());
        dogDTO.setStory(dog.getStory());
        dogDTO.setImage1(base64Image1);
        dogDTO.setImage2("");
        dogDTO.setImage3("");
        dogDTO.setShelterName(dog.getShelter().getName());
        dogDTO.setShelterCity(dog.getShelter().getCity());

        return dogDTO;
    }

    public static MedicalFileDTO toMedicalFileDTO(MedicalFile medicalFile) {
        MedicalFileDTO file = new MedicalFileDTO();
        file.setId(medicalFile.getId());
        file.setFileName(medicalFile.getFileName());
        file.setFileType(medicalFile.getFileType());
        file.setBase64Data(Base64.getEncoder().encodeToString(medicalFile.getData()));

        return file;
    }

    public static Dog toDog(DogDTO dogDTO, Shelter shelter) {
        Dog dog = new Dog();
        dog.setId(dogDTO.getId());
        dog.setName(dogDTO.getName());
        dog.setDescription(dogDTO.getDescription());
        dog.setAge(dogDTO.getAge());
        dog.setGender(dogDTO.getGender());
        if (dogDTO.getSize() != null) {
            dog.setSize(DogSize.valueOf(dogDTO.getSize().toUpperCase()));
        }
        dog.setColor(dogDTO.getColor().toLowerCase());
        dog.setBreed(dogDTO.getBreed());
        dog.setStory(dogDTO.getStory());
        if (dogDTO.getImage1() != null) {
            String cleanedImage = dogDTO.getImage1().replaceAll("[\\n\\r]", "").trim();
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            dog.setImage1(decodedImage);
        }
        /*if (dogDTO.getImage2() != null) {
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
        dog.setShelter(shelter);
        return dog;
    }

    public static ShelterDTO toShelterDTO(Shelter shelter) {
        ShelterDTO shelterDTO = new ShelterDTO();

        // Ensure image is loaded
        String base64Image1 = "";
        if (shelter.getImage1() != null) {
            base64Image1 = Base64.getEncoder().encodeToString(shelter.getImage1());
        }
        String base64Image2 = "";
        if (shelter.getImage2() != null) {
            base64Image2 = Base64.getEncoder().encodeToString(shelter.getImage2());
        }

        shelterDTO.setId(shelter.getId());
        shelterDTO.setName(shelter.getName());
        shelterDTO.setType(shelter.getType());
        shelterDTO.setEmail(shelter.getEmail());
        shelterDTO.setAddress(shelter.getAddress());
        shelterDTO.setCity(shelter.getCity());
        shelterDTO.setDescription(shelter.getDescription());
        shelterDTO.setAvailableDogs(shelter.getAvailableDogs());
        shelterDTO.setTotalNumberOfDogs(shelter.getTotalNumberOfDogs());
        shelterDTO.setPhoneNumber(shelter.getPhoneNumber());
        //shelterDTO.setDogs(shelter.getDogs().stream().map(MapperUtil::toDogDTO).toList());
        shelterDTO.setImage1(base64Image1);
        shelterDTO.setImage2(base64Image2);
        /*List<DogDTO> dogsDTO = shelter.getDogs().stream()
                .map(MapperUtil::toDogDTO)
                .toList();
        shelterDTO.setDogs(dogsDTO);*/
        shelterDTO.setDogs(Collections.emptyList());
        return shelterDTO;
    }

    public static AppointmentDTO toAppointmentDTO(Appointment appointment) {
        AppointmentDTO appointmentDTO = new AppointmentDTO();
        appointmentDTO.setId(appointment.getId());
        appointmentDTO.setUserName(appointment.getUserName());
        appointmentDTO.setShelterName(appointment.getShelterName());
        appointmentDTO.setDateTime(appointment.getDateTime());
        appointmentDTO.setPrice(appointment.getCost());
        appointmentDTO.setStatus(appointment.getStatus());
        appointmentDTO.setDogId(appointment.getDog().getId());
        appointmentDTO.setShelterId(appointment.getShelter().getId());
        appointmentDTO.setUserId(appointment.getUser().getId());
        appointmentDTO.setDogName(appointment.getDogName());
        List<Character> list = new ArrayList<>();

        return appointmentDTO;
    }

    public static Appointment toAppointment(AppointmentDTO appointmentDTO, Dog dog, Shelter shelter, User user) {
        Appointment appointment = new Appointment();
        appointment.setId(appointmentDTO.getId());
        appointment.setUserName(appointmentDTO.getUserName());
        appointment.setDateTime(appointmentDTO.getDateTime());
        appointment.setCost(100.0);
        appointment.setDog(dog);
        appointment.setShelter(shelter);
        appointment.setUser(user);
        appointment.setDogName(appointmentDTO.getDogName());
        appointment.setShelterName(appointmentDTO.getShelterName());
        return appointment;
    }

    public static UserDTO userDTO(User user) {
        UserDTO UserDTO = new UserDTO();
        UserDTO.setId(user.getId());
        UserDTO.setFullName(user.getFullName());
        UserDTO.setEmail(user.getEmail());
        UserDTO.setRole(user.getRole());
        if (user.getShelter() != null) {
            ShelterDTO shelterDTO = toShelterDTO(user.getShelter());
            UserDTO.setShelterDTO(shelterDTO);
        }
        return UserDTO;
    }
}
