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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
        User user = userJpa.findByUsername(taskModel.getUsername())
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found: " + taskModel.getUsername()));
        Task task = mapper.toEntity(taskModel);
        task.setUser(user);

        return mapper.toModel(taskJpa.save(task));
    }

    @Override
    public TaskModel update(Long id, TaskModel taskModel) {

        Task findTask = taskJpa.findById(id).orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));
        User user = userJpa.findByUsername(taskModel.getUsername())
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found: " + taskModel.getUsername()));

        findTask.setUser(user);
        findTask.setTitle(taskModel.getTitle());
        findTask.setDescription(taskModel.getDescription());
        findTask.setPriority(taskModel.getPriority());
        findTask.setDueDate(taskModel.getDueDate());
        return mapper.toModel(taskJpa.save(findTask));
    }

    @Override
    public void delete(Long id) {
        Task task = taskJpa.findById(id).orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));
        taskJpa.delete(task);
    }


    @Override
    public void updateStatus(Long taskid, String status) {
        Task task = taskJpa.findById(taskid).orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskid));
        task.setStatus(Status.valueOf(status));
        taskJpa.save(task);
    }

    @Override
    public Page<TaskModel> findTasks(int page, int size, Status status, Priority priority, String sortBy, String sortDir) {
        // FIXED: validate sortBy to prevent invalid field crashes
        List<String> allowedSortFields = List.of("dueDate", "priority", "createdAt");
        String safeSortBy = allowedSortFields.contains(sortBy) ? sortBy : "dueDate";

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();

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

        return taskPage.map(mapper::toModel);
    }




}
