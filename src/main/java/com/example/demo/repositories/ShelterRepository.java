package com.example.demo.repositories;

import com.example.demo.model.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {
    @Query("SELECT DISTINCT s FROM Shelter s LEFT JOIN FETCH s.dogs")
    List<Shelter> findAllWithDogs();
}
