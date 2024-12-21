package com.example.demo.services;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.RegisterDTO;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Set;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final PasswordService passwordService;
    private final RoleRepository roleRepository;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            PasswordService passwordService,
            RoleRepository roleRepository

    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordService = passwordService;
        this.roleRepository = roleRepository;
    }

    public User signup(RegisterDTO input) {
        User user = new User();
        user.setFullName(input.getFullname());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setNew(true);
        Role role = roleRepository.findByName("ROLE_USER").orElseThrow(() -> new IllegalStateException("Default role not found"));
        user.setRole(role);
        return userRepository.save(user);
    }
    public User signupAdmin(RegisterDTO input) {
        User user = new User();
        user.setFullName(input.getFullname());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setNew(true);
        Role role = roleRepository.findByName("ROLE_ADMIN").orElseThrow(() -> new IllegalStateException("Default role not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    /*public User authenticate(LoginDTO input) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
        return (User) authentication.getPrincipal();

    }*/

    public User authenticate(LoginDTO input) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword())
        );

        // Cast to UserDetails instead of User
        User userDetails = (User) authentication.getPrincipal();
        System.out.println("Authenticated user: " + userDetails);

        // Retrieve the User entity manually if required
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }


    public void resetPassword(String email) {
        try {
            passwordService.resetPassword(email);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to reset password and send email: " + e.getMessage(), e);
        }
    }
}