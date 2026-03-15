package lk.mini.task_backend.data.repository;

import lk.mini.task_backend.data.entity.User;
import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Role;
import lk.mini.task_backend.domain.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserJpa extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

}
