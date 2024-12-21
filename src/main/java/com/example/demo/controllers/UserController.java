package com.example.demo.controllers;

import com.example.demo.dto.ResetPasswordDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;
import com.example.demo.services.PasswordService;
import com.example.demo.services.UserService;
import com.example.demo.util.MapperUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        UserDTO userDTO= MapperUtil.userDTO(currentUser);

        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/")
    public ResponseEntity<List<UserDTO>> allUsers() {
        List<UserDTO> users = userService.allUsers();

        return ResponseEntity.ok(users);
    }

    @PostMapping("/reset")
    public ResponseEntity<Object> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        if (!PasswordService.isPasswordValid(resetPasswordDTO.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password! Password must contain at least one uppercase letter, "
                    + "one lowercase letter, one number, one special character");
        }
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findUserByEmail(email);
            user.setNew(false);
            user.setPassword(resetPasswordDTO.getPassword());
            userService.updateUser(user);
            return ResponseEntity.ok().body("Password reset successfully");
        }catch(UsernameNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
