package com.seguros.auth;

import com.seguros.model.Usuario;
import com.seguros.repository.UsuarioRepository;
import com.seguros.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserDetailsService userDetailsService,
            UsuarioRepository usuarioRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.usuarioRepository = usuarioRepository;
    }

    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica al usuario y retorna un token JWT con los roles y datos personales"
    )
    @SecurityRequirements
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

                Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

                List<String> roles = userDetails.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList();

                String token = jwtService.generateToken(
                        userDetails,
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getApellido()
                );

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "roles", roles,
                        "nombre", usuario.getNombre(),
                        "apellido", usuario.getApellido()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Credenciales inválidas"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales inválidas"));
        }
    }
}
