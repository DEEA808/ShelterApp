package com.example.demo.repositories;

import com.example.demo.model.Dog;
import com.example.demo.model.DogImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface  DogImageRepository extends JpaRepository<DogImage,Long> {
    @Transactional
    void deleteByDogId(Long dogId);
    @Transactional
    void deleteByDogIdAndPosition(Long dogId, int position);

}
