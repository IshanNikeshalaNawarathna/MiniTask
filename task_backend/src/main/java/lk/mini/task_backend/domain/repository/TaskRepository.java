package lk.mini.task_backend.domain.repository;

import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Status;
import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.domain.model.UserModel;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface TaskRepository {

    TaskModel create(TaskModel taskModel);
    TaskModel update(Long id, TaskModel taskModel);
    void delete(Long id);
    void updateStatus(Long taskid, String status);
    Page<TaskModel> findTasks(
            int page,
            int size,
            Status status,
            Priority priority,
            String sortBy,
            String sortDir
    );

}
