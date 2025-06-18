package com.seguros.auth;

import com.seguros.model.Usuario;
import com.seguros.repository.UsuarioRepository;
import com.seguros.security.JwtService;
import com.seguros.security.UsuarioDetails;
import com.seguros.security.UsuarioDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.filter.CharacterEncodingFilter;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @Mock private UsuarioDetailsService userDetailsService;
    @InjectMocks private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .addFilters(new CharacterEncodingFilter("UTF-8", true))
                .build();
    }

    @Test
    void testLogin_exitoso() throws Exception {
        String email = "test@mail.com";
        String password = "123456";
        String token = "jwt_token_example";
        Long usuarioId = 1L;
        String nombre = "Juan";
        String apellido = "Pérez";

        // Mock de la autenticación
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        // Crear objeto Usuario real
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(password);

        // Autoridad simulada
        GrantedAuthority authority = () -> "ROLE_USER";
        Collection<GrantedAuthority> authorities = Arrays.asList(authority);

        // Crear UsuarioDetails real con el usuario
        UsuarioDetails userDetails = new UsuarioDetails(usuario, authorities);

        // Mock del servicio que retorna UsuarioDetails
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);

        // Mock del repositorio
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));

        // Inyectar mocks en campos privados
        ReflectionTestUtils.setField(authController, "authenticationManager", authenticationManager);
        ReflectionTestUtils.setField(authController, "jwtService", jwtService);
        ReflectionTestUtils.setField(authController, "userDetailsService", userDetailsService);
        ReflectionTestUtils.setField(authController, "usuarioRepository", usuarioRepository);

        // Mock del token
        when(jwtService.generateToken(userDetails, usuarioId, nombre, apellido)).thenReturn(token);

        // Ejecutar solicitud
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.nombre").value(nombre))
                .andExpect(jsonPath("$.apellido").value(apellido))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));

        // Verificaciones
        verify(authenticationManager).authenticate(any());
        verify(jwtService).generateToken(userDetails, usuarioId, nombre, apellido);
    }

    @Test
    void testLogin_credencialesInvalidas() throws Exception {
        String email = "mal@mail.com";
        String password = "incorrecto";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Credenciales inválidas"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLogin_camposVacios() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"\", \"password\": \"\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLogin_jsonMalFormado() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{email: 'sin comillas'}")) // JSON inválido
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_sinPassword() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"test@mail.com\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLogin_sinEmail() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\": \"123456\"}"))
                .andExpect(status().isUnauthorized());
    }

}
