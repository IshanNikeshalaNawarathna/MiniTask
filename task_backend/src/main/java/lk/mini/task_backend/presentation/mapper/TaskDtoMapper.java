package lk.mini.task_backend.presentation.mapper;

import lk.mini.task_backend.domain.model.TaskModel;
import lk.mini.task_backend.presentation.dto.task.TaskRequest;
import lk.mini.task_backend.presentation.dto.task.TaskResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskDtoMapper {

    @Mapping(target = "username", source = "username")
    TaskModel toModel(TaskRequest taskRequest);
    TaskResponse toDto(TaskModel taskModel);

}
