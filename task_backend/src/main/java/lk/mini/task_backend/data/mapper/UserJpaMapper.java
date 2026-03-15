package lk.mini.task_backend.data.mapper;

import lk.mini.task_backend.data.entity.User;
import lk.mini.task_backend.domain.model.UserModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserJpaMapper {

    @Mapping(target = "password", ignore = true)
    UserModel toModel(User user);


}
