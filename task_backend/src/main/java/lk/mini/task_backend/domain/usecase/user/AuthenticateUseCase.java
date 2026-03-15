package lk.mini.task_backend.domain.usecase.user;

import lk.mini.task_backend.domain.repository.AuthRepository;
import lk.mini.task_backend.presentation.dto.user.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticateUseCase {

    private final AuthRepository authRepository;

    public AuthResponse authenticateAndGenerateToken(String username, String password) {
        UserDetails userDetails = authRepository.authenticate(username, password);
        String token = authRepository.generateToken(userDetails);
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        return new AuthResponse(token, userDetails.getUsername(), role);
    }
}