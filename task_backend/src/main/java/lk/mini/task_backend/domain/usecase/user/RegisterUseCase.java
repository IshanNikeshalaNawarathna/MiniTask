package lk.mini.task_backend.domain.usecase.user;

import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegisterUseCase {

    private final UserRepository userRepository;

    public void register(UserModel user) {
        userRepository.register(user);
    }


}
