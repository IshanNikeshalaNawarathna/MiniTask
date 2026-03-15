package lk.mini.task_backend.presentation.mapper;

import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.presentation.dto.user.UserRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {

    @Mapping(target = "tasks", ignore = true)
    UserModel toModel(UserRequest userRequest);
}
