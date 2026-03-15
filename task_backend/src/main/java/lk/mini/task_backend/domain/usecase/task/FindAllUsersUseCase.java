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
                                                Status status,
                                                Priority priority,
                                                String sortBy,
                                                String sortDir
    ) {
        Page<TaskModel> taskPage =
                taskRepository.findTasks(page, size, status, priority, sortBy, sortDir);

        return new PageResponse<>(
                taskPage.getNumber(),
                taskPage.getSize(),
                taskPage.getTotalElements(),
                taskPage.getTotalPages(),
                taskPage.getContent()
        );
    }
}
