package lk.mini.task_backend.domain.model;

import lk.mini.task_backend.data.entity.User;
import lk.mini.task_backend.domain.enums.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskModel {

    private UUID id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private String dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String username;

}
