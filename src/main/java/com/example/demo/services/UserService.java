package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
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

    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
