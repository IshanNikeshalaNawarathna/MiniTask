package lk.mini.task_backend.domain.usecase.task;

import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Status;
import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.domain.repository.TaskRepository;
import lk.mini.task_backend.presentation.dto.task.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FindAllUsersUseCase {


    private final TaskRepository taskRepository;

    public PageResponse<TaskModel> findTasks(   // FIXED: returns TaskModel
                                                int page,
                                                int size,
                                                String status,
                                                String priority,
                                                String sortBy,
                                                String sortDir
    ) {

        Status statusEnum = null;
        Priority priorityEnum = null;

        try {
            if (status != null && !status.isEmpty()) {
                statusEnum = Status.valueOf(status);
            }
            if (priority != null && !priority.isEmpty()) {
                priorityEnum = Priority.valueOf(priority);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status or priority");
        }

        Page<TaskModel> taskPage =
                taskRepository.findTasks(page, size, statusEnum, priorityEnum, sortBy, sortDir);

        return new PageResponse<>(
                taskPage.getNumber(),
                taskPage.getSize(),
                taskPage.getTotalElements(),
                taskPage.getTotalPages(),
                taskPage.getContent()
        );
    }
}
