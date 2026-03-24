package lk.mini.task_backend.domain.model;


import lk.mini.task_backend.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    private UUID id;
    private String username;
    private String password;
    private Role role;
    private List<TaskModel> tasks;

}
