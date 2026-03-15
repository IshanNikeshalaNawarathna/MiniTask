package lk.mini.task_backend.data.adapter;

import lk.mini.task_backend.data.entity.User;
import lk.mini.task_backend.data.repository.UserJpa;
import lk.mini.task_backend.domain.enums.Role;
import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpa userJpa;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(UserModel users) {

        if (userJpa.findByUsername(users.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(users.getUsername());
        user.setPassword(passwordEncoder.encode(users.getPassword()));
        System.out.println(users.getRole());
        user.setRole(users.getRole() != null ? users.getRole() : Role.USER);


        userJpa.save(user);
    }
}
