package lk.mini.task_backend.domain.repository;

import lk.mini.task_backend.domain.model.UserModel;

import java.util.List;

public interface UserRepository {
    void register(UserModel user);
    List<UserModel> findAllUser();
}
