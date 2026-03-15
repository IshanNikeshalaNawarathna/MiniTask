package lk.mini.task_backend.domain.repository;

import lk.mini.task_backend.domain.model.UserModel;

public interface UserRepository {
    void register(UserModel user);
}
