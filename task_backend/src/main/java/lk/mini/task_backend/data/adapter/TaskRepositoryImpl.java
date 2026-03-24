package lk.mini.task_backend.data.adapter;

import jakarta.persistence.EntityNotFoundException;
import lk.mini.task_backend.data.entity.Task;
import lk.mini.task_backend.data.entity.User;
import lk.mini.task_backend.data.mapper.TaskJpaMapper;
import lk.mini.task_backend.data.mapper.UserJpaMapper;
import lk.mini.task_backend.data.repository.TaskJpa;
import lk.mini.task_backend.data.repository.UserJpa;
import lk.mini.task_backend.domain.enums.Priority;
import lk.mini.task_backend.domain.enums.Role;
import lk.mini.task_backend.domain.enums.Status;
import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskRepositoryImpl implements TaskRepository {

    private final TaskJpa taskJpa;
    private final UserJpa userJpa;
    private final TaskJpaMapper mapper;
    private final UserJpaMapper userMapper;

    @Override
    public TaskModel create(TaskModel taskModel) {
        System.out.println("taskModel:"+taskModel.toString());
        Task task = mapper.toEntity(taskModel);
        return mapper.toModel(taskJpa.save(task));
    }

    @Override
    public TaskModel update(UUID id, TaskModel taskModel) {

        Task findTask = taskJpa.findById(id).orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        findTask.setTitle(taskModel.getTitle());
        findTask.setDescription(taskModel.getDescription());
        findTask.setPriority(taskModel.getPriority());
        findTask.setStatus(taskModel.getStatus());
        findTask.setDueDate(LocalDate.parse(taskModel.getDueDate()));
        return mapper.toModel(taskJpa.save(findTask));
    }

    @Override
    public void delete(UUID id) {
        Task task = taskJpa.findById(id).orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));
        taskJpa.delete(task);
    }


    @Override
    public void updateStatus(UUID taskid, String status, String username) {
        Task task = taskJpa.findById(taskid).orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskid));
        User user = userJpa.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        task.setUser(user);
        task.setStatus(Status.valueOf(status));
        taskJpa.save(task);
    }

    @Override
    public Page<TaskModel> findTasks(int page, int size, Status status, Priority priority, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Task> taskPage;
        if (status != null && priority != null) {
            taskPage = taskJpa.findByStatusAndPriority(status, priority, pageable);
        } else if (status != null) {
            taskPage = taskJpa.findByStatus(status, pageable);
        } else if (priority != null) {
            taskPage = taskJpa.findByPriority(priority, pageable);
        } else {
            taskPage = taskJpa.findAll(pageable);
        }

        List<TaskModel> taskList = taskPage.getContent().stream().map(task -> mapper.toModel(task)).toList();

        return new PageImpl<>(
                taskList,
                pageable,
                taskPage.getTotalElements()
        );
    }




}
