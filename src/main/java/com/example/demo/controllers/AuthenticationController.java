package com.example.demo.controllers;

import com.example.demo.dto.*;
import com.example.demo.model.User;
import com.example.demo.services.AuthenticationService;
import com.example.demo.services.JwtService;
import com.example.demo.services.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> register(@RequestBody RegisterDTO registerUserDto) {
        if(!PasswordService.isPasswordValid(registerUserDto.getPassword()))
            return ResponseEntity.badRequest().body("Invalid password! Password must contain at least one uppercase letter, "
                    + "one lowercase letter, one number, one special character");
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/signupAdmin")
    public ResponseEntity<Object> registerAdmin(@RequestBody RegisterDTO registerUserDto) {
        if(!PasswordService.isPasswordValid(registerUserDto.getPassword()))
            return ResponseEntity.badRequest().body("Invalid password! Password must contain at least one uppercase letter, "
                    + "one lowercase letter, one number, one special character");
        User registeredUser = authenticationService.signupAdmin(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> authenticate(@RequestBody LoginDTO loginUserDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);

            System.out.println(jwtToken);
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpriresIn(jwtService.getExpirationTime());

            return ResponseEntity.ok(loginResponse);
        }catch(BadCredentialsException exception){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Forgotten password?");
        }
    }

    @PostMapping("/change")
    public ResponseEntity<Object> resetPassword(@RequestBody EmailDTO emailDTO) {
        try {
            authenticationService.resetPassword(emailDTO.getEmail());
            return ResponseEntity.ok("Reset password completed");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password reset email sent unsuccessfully.");
        }
    }
}