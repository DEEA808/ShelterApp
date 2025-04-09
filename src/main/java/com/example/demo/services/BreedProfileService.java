package com.example.demo.services;

import com.example.demo.model.BreedProfile;
import com.example.demo.repositories.BreedProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BreedProfileService {
    private final BreedProfileRepository breedProfileRepository;

    public BreedProfileService(BreedProfileRepository breedProfileRepository) {
        this.breedProfileRepository = breedProfileRepository;
    }

    public void add(BreedProfile breedProfile) {
        try {
            breedProfileRepository.save(breedProfile);
        } catch (IllegalArgumentException e) {
            System.out.println("Error saving breedProfile");
        } catch (RuntimeException e) {
            System.out.println("An unexpected error occurred while saving breedProfile");
        }
    }

    public BreedProfile getBreedProfileById(String name) {
        Optional<BreedProfile> breedProfile = breedProfileRepository.findByName(name);
        return breedProfile.orElse(null);
    }
}
