package lk.mini.task_backend.domain.usecase.task;

import lk.mini.task_backend.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskUpdateStatusUseCase {

    private final TaskRepository taskRepository;

    public void statusUpdate(Long taskid, String status) {
        taskRepository.updateStatus(taskid, status);
    }

}
