package com.example.demo.controllers;/*
package com.example.demo.controllers;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repositories.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitializeDataController {
    private final RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        if (!roleRepository.findByName("ROLE_USER").isPresent()) {
            roleRepository.save(new Role(null, "ROLE_USER"));
        }
        if (!roleRepository.findByName("ROLE_ADMIN").isPresent()) {
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
        }
    }
}
*/

/*import com.example.demo.model.BreedProfile;
import com.example.demo.repositories.BreedProfileRepository;
import com.example.demo.services.CsvService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitializeDataController {
    private final BreedProfileRepository breedProfileRepository;

    @PostConstruct
    public void init() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("data/breed_traits_dd.csv")) {
            if (is == null) throw new RuntimeException("CSV file not found!");

            List<BreedProfile> breeds = CsvService.parseCsvBreedProfile(is);
            breedProfileRepository.saveAll(breeds);
            System.out.println("Breed profiles imported: " + breeds.size());

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV: " + e.getMessage());
        }
    }
}*/
