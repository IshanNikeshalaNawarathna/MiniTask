package lk.mini.task_backend.domain.usecase.task;

import lk.mini.task_backend.domain.enums.Status;
import lk.mini.task_backend.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TaskUpdateStatusUseCase {

    private final TaskRepository taskRepository;
    private Authentication authentication;

    public void statusUpdate(UUID taskid) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        String username = authentication.getName();
        System.out.println("username = " + username);

        String status = String.valueOf(Status.DONE);
        taskRepository.updateStatus(taskid, status, username);
    }

}
