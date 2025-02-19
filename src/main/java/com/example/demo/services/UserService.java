package com.example.demo.services;

import com.example.demo.dto.UserDTO;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.util.MapperUtil;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
