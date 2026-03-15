package lk.mini.task_backend.data.repository;

import lk.mini.task_backend.data.entity.Task;
import lk.mini.task_backend.data.entity.User;
import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskJpa extends JpaRepository<Task, Long> {
    Page<Task> findByStatus(Status status, Pageable pageable);
    Page<Task> findByPriority(Priority priority, Pageable pageable);
    Page<Task> findByStatusAndPriority(Status status, Priority priority, Pageable pageable);
}
