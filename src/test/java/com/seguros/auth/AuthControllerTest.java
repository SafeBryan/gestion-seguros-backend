package com.seguros.auth;

import com.seguros.security.JwtService;
import com.seguros.security.UsuarioDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.security.authentication.BadCredentialsException;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UsuarioDetailsService userDetailsService;

    @InjectMocks
    private AuthController authController;

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

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        // Simula un Authentication exitoso
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true); // Simula la autenticación
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        // Simula la generación del token JWT
        when(jwtService.generateToken(email)).thenReturn(token);

        mockMvc.perform(post("/api/auth/login")
                    .contentType("application/json")
                    .content("{\"email\": \"test@mail.com\", \"password\": \"123456\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value(token));

        verify(authenticationManager).authenticate(any());
        verify(jwtService).generateToken(email);
    }
//
//    @Test
//    void testLogin_fail_invalidCredentials() throws Exception {
//        String email = "test@mail.com";
//        String password = "wrongpassword";
//
//        LoginRequest loginRequest = new LoginRequest();
//        loginRequest.setEmail(email);
//        loginRequest.setPassword(password);
//
//        // Simula que la autenticación falla y lanza una BadCredentialsException
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
//                .thenThrow(new BadCredentialsException("Credenciales inválidas"));
//
//        mockMvc.perform(post("/api/auth/login")
//                    .contentType("application/json")
//                    .content("{\"email\": \"test@mail.com\", \"password\": \"wrongpassword\"}"))
//            .andExpect(status().isUnauthorized())  // Código de estado 401 para credenciales inválidas
//            .andExpect(jsonPath("$.message").value("Credenciales inválidas"));  // Asegúrate de que se devuelve el mensaje adecuado
//
//        verify(authenticationManager).authenticate(any());
//    }
}
