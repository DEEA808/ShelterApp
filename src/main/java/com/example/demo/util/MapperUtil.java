package com.example.demo.util;

import com.example.demo.dto.ShelterDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;

public class MapperUtil {

    public static Shelter toShelter(ShelterDTO shelterDTO, User admin) {
        Shelter shelter = new Shelter();
        shelter.setId(shelterDTO.getId());
        shelter.setName(shelterDTO.getName());
        shelter.setEmail(shelterDTO.getEmail());
        shelter.setAddress(shelterDTO.getAddress());
        shelter.setDescription(shelterDTO.getDescription());
        shelter.setAvailableDogs(shelterDTO.getAvailableDogs());
        shelter.setTotalNumberOfDogs(shelterDTO.getTotalNumberOfDogs());
        shelter.setPhoneNumber(shelterDTO.getPhoneNumber());
        /* shelter.setAdmin(admin);*/

        if (shelterDTO.getImage() != null) {
            String cleanedImage = shelterDTO.getImage().replaceAll("[\\n\\r]", "").trim();
           /* if (cleanedImage.startsWith("data:image/")) {
                cleanedImage = cleanedImage.substring(cleanedImage.indexOf(",") + 1);
            }*/
            byte[] decodedImage = Base64.getDecoder().decode(cleanedImage);
            System.out.println("Decoded Image Byte Array Size: " + decodedImage.length);
            shelter.setImage(decodedImage);
        }
        admin.setShelter(shelter);
        return shelter;
    }

   /* public static ShelterDTO toShelterDTO(Shelter shelter) {
        ShelterDTO shelterDTO = new ShelterDTO();
        String base64Image = "";
        if (shelterDTO.getImage() != null) {
            base64Image = Base64.getEncoder().encodeToString(shelter.getImage());
        }

        shelterDTO.setId(shelter.getId());
        shelterDTO.setName(shelter.getName());
        shelterDTO.setEmail(shelter.getEmail());
        shelterDTO.setAddress(shelter.getAddress());
        shelterDTO.setDescription(shelter.getDescription());
        shelterDTO.setAvailableDogs(shelter.getAvailableDogs());
        shelterDTO.setTotalNumberOfDogs(shelter.getTotalNumberOfDogs());
        shelterDTO.setPhoneNumber(shelter.getPhoneNumber());
        shelterDTO.setImage(base64Image);

        return shelterDTO;
    }*/
  // @Transactional
   public static ShelterDTO toShelterDTO(Shelter shelter) {
       ShelterDTO shelterDTO = new ShelterDTO();

       // Ensure image is loaded
       String base64Image = "";
       if (shelter.getImage() != null) {
           base64Image = Base64.getEncoder().encodeToString(shelter.getImage());
       }

       shelterDTO.setId(shelter.getId());
       shelterDTO.setName(shelter.getName());
       shelterDTO.setEmail(shelter.getEmail());
       shelterDTO.setAddress(shelter.getAddress());
       shelterDTO.setDescription(shelter.getDescription());
       shelterDTO.setAvailableDogs(shelter.getAvailableDogs());
       shelterDTO.setTotalNumberOfDogs(shelter.getTotalNumberOfDogs());
       shelterDTO.setPhoneNumber(shelter.getPhoneNumber());
       shelterDTO.setImage(base64Image);

       return shelterDTO;
   }

    public static UserDTO userDTO(User user) {
        UserDTO UserDTO = new UserDTO();
        UserDTO.setId(user.getId());
        UserDTO.setFullName(user.getFullName());
        UserDTO.setEmail(user.getEmail());
        UserDTO.setRole(user.getRole());
        if(user.getShelter()!=null){
        ShelterDTO shelterDTO = toShelterDTO(user.getShelter());
        UserDTO.setShelterDTO(shelterDTO);
        }
        return UserDTO;
    }
}
