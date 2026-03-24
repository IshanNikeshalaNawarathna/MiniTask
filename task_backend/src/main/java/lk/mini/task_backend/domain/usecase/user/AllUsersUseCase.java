package lk.mini.task_backend.domain.usecase.user;

import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AllUsersUseCase {

    private final UserRepository userRepository;

    public List<UserModel> allUsers() {
        return userRepository.findAllUser();
    }

}
