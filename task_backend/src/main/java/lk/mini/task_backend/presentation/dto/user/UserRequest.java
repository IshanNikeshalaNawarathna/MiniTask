package lk.mini.task_backend.presentation.dto.user;

import lk.mini.task_backend.domain.enums.Role;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;

}
