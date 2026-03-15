package lk.mini.task_backend.domain.usecase.task;

import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskSaveUseCase {

    private final TaskRepository taskRepository;

    public TaskModel create(TaskModel taskModel) {
        return taskRepository.create(taskModel);
    }

}
