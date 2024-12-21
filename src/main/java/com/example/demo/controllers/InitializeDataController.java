/*
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
