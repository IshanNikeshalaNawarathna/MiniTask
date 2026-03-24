package lk.mini.task_backend.presentation.controller;

import lk.mini.task_backend.domain.model.UserModel;
import lk.mini.task_backend.domain.usecase.user.AllUsersUseCase;
import lk.mini.task_backend.domain.usecase.user.AuthenticateUseCase;
import lk.mini.task_backend.domain.usecase.user.RegisterUseCase;
import lk.mini.task_backend.presentation.dto.user.AuthResponse;
import lk.mini.task_backend.presentation.dto.user.UserRequest;
import lk.mini.task_backend.presentation.dto.user.UserResponse;
import lk.mini.task_backend.presentation.mapper.UserDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final RegisterUseCase registerUseCase;
    private final AuthenticateUseCase authenticateUseCase;
    private final AllUsersUseCase allUsersUseCase;
    private final UserDtoMapper mapper;

    @PostMapping
    public ResponseEntity<Void> register(@RequestBody UserRequest userRequest) {
        UserModel model = mapper.toModel(userRequest);
        registerUseCase.register(model);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> login(@RequestBody UserRequest request){
        AuthResponse authResponse = authenticateUseCase.authenticateAndGenerateToken(
                request.getUsername(),
                request.getPassword()
        );

        return ResponseEntity.ok(authResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponse>> findAllUsers(){
        List<UserModel> userModels = allUsersUseCase.allUsers();
        List<UserResponse> list = userModels.stream().map(userModel -> mapper.toDto(userModel)).toList();
        return ResponseEntity.ok(list);
    }

}