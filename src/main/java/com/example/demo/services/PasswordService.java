package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class PasswordService {
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!$&#?";

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static boolean isPasswordValid(String password) {
        boolean contaisUpperCase = false;
        boolean contaisLowerCase = false;
        boolean contaisDigit = false;
        boolean contaisSpecial = false;
        if (password.length() < 5) {
            return false;
        }
        for(int i = 0; i < password.length(); i++) {
            char c = password.charAt(i);
            if(UPPERCASE.indexOf(c)!=-1) contaisUpperCase = true;
            if(LOWERCASE.indexOf(c)!=-1) contaisLowerCase = true;
            if(DIGITS.indexOf(c)!=-1) contaisDigit = true;
            if(SPECIAL_CHARACTERS.indexOf(c)!=-1) contaisSpecial = true;
        }
        return contaisUpperCase && contaisDigit && contaisSpecial && contaisLowerCase;

    }

    public  void resetPassword(String email) throws MessagingException {
        String newPassword = generateRandomPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        sendPasswordResetEmail(email, newPassword);
    }

    private  String generateRandomPassword() {
        String all = UPPERCASE + LOWERCASE + DIGITS + SPECIAL_CHARACTERS;

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        password.append(UPPERCASE.charAt(random.nextInt(UPPERCASE.length())));
        password.append(LOWERCASE.charAt(random.nextInt(LOWERCASE.length())));
        password.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        password.append(SPECIAL_CHARACTERS.charAt(random.nextInt(SPECIAL_CHARACTERS.length())));

        for (int i = 4; i < 12; i++) { // Assuming password length = 12
            password.append(all.charAt(random.nextInt(all.length())));
        }

        return password.chars()
                .mapToObj(c -> (char) c)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

    private  void sendPasswordResetEmail(String email, String newPassword) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("Password Reset Request");
        helper.setText("<p>Your password has been reset.</p>" +
                "<p>Your new password is: <b>" + newPassword + "</b></p>", true);

        mailSender.send(message);
    }
}
