package lk.mini.task_backend.domain.usecase.task;

import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TaskDeleteUseCase {

    private final TaskRepository taskRepository;

    public void delete(Long id) {
       taskRepository.delete(id);
    }

}
