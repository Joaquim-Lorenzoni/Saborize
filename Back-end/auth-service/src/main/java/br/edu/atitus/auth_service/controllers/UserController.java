package br.edu.atitus.auth_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.auth_service.dtos.UserProfileDTO;
import br.edu.atitus.auth_service.entities.UserEntity;
import br.edu.atitus.auth_service.repositories.UserRepository;

@RestController
@RequestMapping("/ws/users")
public class UserController {


    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @GetMapping("/me")
    public ResponseEntity<UserEntity> getLoggedUser(
            @RequestHeader("X-User-Id") Long userId) {
        
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        
        return ResponseEntity.ok(user);
    }


    @PutMapping("/me/preferences")
    public ResponseEntity<UserEntity> updateUserPreferences(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UserProfileDTO dto) {


        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));


        user.setNotificationsEnabled(dto.notificationsEnabled());
        user.setDarkModeEnabled(dto.darkModeEnabled());
        user.setFontSize(dto.fontSize());
        user.setPreferredCurrency(dto.preferredCurrency());


        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}