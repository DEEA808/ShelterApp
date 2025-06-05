package com.example.demo.services;

import com.example.demo.dto.DogDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.repositories.DogRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final DogRepository dogRepository;

    public UserService(UserRepository userRepository, DogRepository dogRepository) {
        this.userRepository = userRepository;
        this.dogRepository = dogRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> allUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(MapperUtil::userDTO).toList();
    }

    public boolean findByEmail(String email){
        return userRepository.findByEmail(email).isPresent();
    }

    public User findUserByEmail(String email) {
        if(!userRepository.findByEmail(email).isPresent())
        {
            throw new UsernameNotFoundException("The user does not exist");
        }
        else return userRepository.findByEmail(email).get();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).get();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void addFavoriteDog(Long userId, Long dogId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(() -> new RuntimeException("Dog not found"));

        user.getFavoriteDogs().add(dog);
        userRepository.save(user);
    }

    @Transactional
    public void removeFavoriteDog(Long userId, Long dogId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dog dog = dogRepository.findById(dogId)
                .orElseThrow(() -> new RuntimeException("Dog not found"));

        user.getFavoriteDogs().remove(dog);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Set<DogDTO> getFavoriteDogs(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getFavoriteDogs().stream().map(MapperUtil::toDogDTO).collect(Collectors.toSet());
    }

}
