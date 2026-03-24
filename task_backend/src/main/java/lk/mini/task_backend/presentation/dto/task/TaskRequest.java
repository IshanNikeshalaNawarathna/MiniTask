package lk.mini.task_backend.presentation.dto.task;

import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Status;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private String dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    //private UUID userId;
}
