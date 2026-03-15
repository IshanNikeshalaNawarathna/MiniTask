package lk.mini.task_backend.data.mapper;

import lk.mini.task_backend.data.entity.Task;
import lk.mini.task_backend.domain.model.TaskModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskJpaMapper {

    @Mapping(target = "username", source = "user.username")
    TaskModel toModel(Task task);
    Task toEntity(TaskModel taskModel);

}
