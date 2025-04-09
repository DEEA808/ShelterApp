package com.example.demo.repositories;

import com.example.demo.model.BreedProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BreedProfileRepository extends JpaRepository<BreedProfile, Long> {
    Optional<BreedProfile> findByName(String name);
}
