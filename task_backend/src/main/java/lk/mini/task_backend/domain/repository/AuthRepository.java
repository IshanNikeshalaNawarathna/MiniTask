package lk.mini.task_backend.domain.repository;


import org.springframework.security.core.userdetails.UserDetails;

public interface AuthRepository {
    UserDetails authenticate(String username, String password);
    String generateToken(UserDetails userDetails);
}
