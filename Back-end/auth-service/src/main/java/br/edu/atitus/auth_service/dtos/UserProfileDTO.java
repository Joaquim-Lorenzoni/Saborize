package br.edu.atitus.auth_service.dtos;

import br.edu.atitus.auth_service.entities.FontSize;


public record UserProfileDTO(
    boolean notificationsEnabled,
    boolean darkModeEnabled,
    FontSize fontSize,
    String preferredCurrency
) {
    
}