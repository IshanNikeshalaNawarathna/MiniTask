package lk.mini.task_backend.presentation.controller;

import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Status;
import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.domain.usecase.task.*;
import lk.mini.task_backend.presentation.dto.task.PageResponse;
import lk.mini.task_backend.presentation.dto.task.TaskRequest;
import lk.mini.task_backend.presentation.dto.task.TaskResponse;
import lk.mini.task_backend.presentation.mapper.TaskDtoMapper;
import lk.mini.task_backend.presentation.mapper.UserDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskDeleteUseCase taskDeleteUseCase;
    private final TaskUpdateUseCase taskUpdateUseCase;
    private final TaskSaveUseCase taskSaveUseCase;
    private final TaskDtoMapper mapper;
    private final FindAllUsersUseCase findAllUsersUseCase;
    private final UserDtoMapper userDtoMapper;
    private final TaskUpdateStatusUseCase taskUpdateStatusUseCase;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TaskResponse> saveTask(@Validated @RequestBody TaskRequest taskRequest) {
        TaskModel taskModel = mapper.toModel(taskRequest);
        TaskModel saveModel = taskSaveUseCase.create(taskModel);
        return new ResponseEntity<>(mapper.toDto(saveModel), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userid}")
    public ResponseEntity<TaskResponse> updateTask(@RequestBody TaskRequest taskRequest, @PathVariable Long userid) {
        TaskModel taskModel = mapper.toModel(taskRequest);
        TaskModel updateTask = taskUpdateUseCase.update(userid, taskModel);
        return new ResponseEntity<>(mapper.toDto(updateTask), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{taskid}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskid) {
        taskDeleteUseCase.delete(taskid);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{taskid}/{status}")
    public ResponseEntity<Void> updateStatus(@PathVariable Long taskid, @PathVariable String status) {
        taskUpdateStatusUseCase.statusUpdate(taskid, status);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public ResponseEntity<PageResponse<TaskResponse>> findTasks(  // FIXED: TaskResponse DTO
                                                                  @RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "5") int size,

                                                                  @RequestParam(required = false) Status status,
                                                                  @RequestParam(required = false) Priority priority,

                                                                  @RequestParam(defaultValue = "dueDate") String sortBy,
                                                                  @RequestParam(defaultValue = "asc") String sortDir
    ) {
        // FIXED: use FindAllTasksUseCase, not FindAllUsersUseCase
        PageResponse<TaskModel> tasks =
                findAllUsersUseCase.findTasks(page, size, status, priority, sortBy, sortDir);

        List<TaskResponse> dtoList =
                tasks.getData().stream()
                        .map(mapper::toDto)   // FIXED: taskDtoMapper, not userDtoMapper
                        .toList();

        PageResponse<TaskResponse> response =
                new PageResponse<>(
                        tasks.getPage(),
                        tasks.getSize(),
                        tasks.getTotalElements(),
                        tasks.getTotalPages(),
                        dtoList
                );

        return ResponseEntity.ok(response);
    }

}
