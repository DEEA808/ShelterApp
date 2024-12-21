package com.example.demo.dto;

import com.example.demo.model.Role;
import com.example.demo.model.Shelter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private ShelterDTO shelterDTO;
}
