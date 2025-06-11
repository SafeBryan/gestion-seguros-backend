package com.seguros.service;

import com.seguros.dto.RegistroDTO;
import com.seguros.dto.UsuarioDTO;
import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import com.seguros.repository.RolRepository;
import com.seguros.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private RegistroDTO crearRegistroDTO() {
        RegistroDTO dto = new RegistroDTO();
        dto.setEmail("test@mail.com");
        dto.setPassword("123456");
        dto.setNombre("Juan");
        dto.setApellido("Pérez");
        dto.setTelefono("123456789");
        dto.setRolId(1L);
        return dto;
    }

    private Usuario crearUsuario(Long id, String email, String nombre, String apellido, String telefono, String rolNombre) {
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre(rolNombre);

        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setEmail(email);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setTelefono(telefono);
        usuario.setRol(rol);
        usuario.setActivo(true);

        return usuario;
    }

    @Test
    void testCrearUsuario_exito() {
        RegistroDTO dto = crearRegistroDTO();
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("USER");

        when(usuarioRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        when(rolRepository.findById(1L)).thenReturn(Optional.of(rol));
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encoded123");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario result = usuarioService.crearUsuario(dto);

        assertNotNull(result);
        assertEquals("test@mail.com", result.getEmail());
        assertEquals("encoded123", result.getPassword());
        assertEquals("USER", result.getRol().getNombre());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void testCrearUsuario_emailYaExiste() {
        RegistroDTO dto = crearRegistroDTO();
        when(usuarioRepository.existsByEmail(dto.getEmail())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> usuarioService.crearUsuario(dto));
        assertEquals("El email ya está registrado", ex.getMessage());
    }

    @Test
    void testCrearUsuario_rolNoExiste() {
        RegistroDTO dto = crearRegistroDTO();
        when(usuarioRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        when(rolRepository.findById(dto.getRolId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> usuarioService.crearUsuario(dto));
        assertEquals("Rol no encontrado", ex.getMessage());
    }

    @Test
    void testObtenerUsuariosPorRol() {
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ADMIN");

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Ana");
        usuario.setApellido("Gómez");
        usuario.setEmail("ana@mail.com");
        usuario.setTelefono("999888777");
        usuario.setRol(rol);
        usuario.setActivo(true);

        when(usuarioRepository.findByRolNombre("ADMIN")).thenReturn(List.of(usuario));

        List<UsuarioDTO> result = usuarioService.obtenerUsuariosPorRol("ADMIN");

        assertEquals(1, result.size());
        assertEquals("ana@mail.com", result.get(0).getEmail());
        assertEquals("ADMIN", result.get(0).getRolNombre());
    }

    @Test
    void testActualizarEstado_exito() {
        Usuario usuario = new Usuario();
        usuario.setId(10L);
        usuario.setActivo(false);

        when(usuarioRepository.findById(10L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario actualizado = usuarioService.actualizarEstado(10L, true);

        assertTrue(actualizado.isActivo());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void testActualizarEstado_usuarioNoExiste() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> usuarioService.actualizarEstado(999L, true));
        assertEquals("Usuario no encontrado", ex.getMessage());
    }

    @Test
    void testObtenerTodosUsuarios() {
        Usuario usuario1 = crearUsuario(1L, "usuario1@mail.com", "Carlos", "Lopez", "123456789", "USER");
        Usuario usuario2 = crearUsuario(2L, "usuario2@mail.com", "Luis", "Pérez", "987654321", "USER");

        when(usuarioRepository.findAll()).thenReturn(List.of(usuario1, usuario2));

        List<UsuarioDTO> result = usuarioService.obtenerTodosUsuarios();

        assertEquals(2, result.size());
        assertEquals("usuario1@mail.com", result.get(0).getEmail());
        assertEquals("usuario2@mail.com", result.get(1).getEmail());
        assertEquals("USER", result.get(0).getRolNombre());
    }

    @Test
    void testObtenerUsuario_exito() {
        Usuario usuario = crearUsuario(1L, "usuario@mail.com", "Juan", "Pérez", "123456789", "USER");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario result = usuarioService.obtenerUsuario(1L);

        assertNotNull(result);
        assertEquals("usuario@mail.com", result.getEmail());
    }

    @Test
    void testObtenerUsuario_noEncontrado() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> usuarioService.obtenerUsuario(999L));
        assertEquals("Usuario no encontrado", ex.getMessage());
    }

    @Test
    void testActualizarUsuario_exito() {
        Usuario usuarioExistente = crearUsuario(1L, "original@mail.com", "Luis", "Pérez", "123456789", "USER");
        UsuarioDTO dto = new UsuarioDTO();
        dto.setEmail("nuevo@mail.com");
        dto.setNombre("Luis");
        dto.setApellido("Pérez");
        dto.setTelefono("987654321");
        dto.setRolId(2L);

        Rol nuevoRol = new Rol();
        nuevoRol.setId(2L);
        nuevoRol.setNombre("ADMIN");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.existsByEmail("nuevo@mail.com")).thenReturn(false);
        when(rolRepository.findById(2L)).thenReturn(Optional.of(nuevoRol));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario actualizado = usuarioService.actualizarUsuario(1L, dto);

        assertEquals("nuevo@mail.com", actualizado.getEmail());
        assertEquals("987654321", actualizado.getTelefono());
        assertEquals("ADMIN", actualizado.getRol().getNombre());
    }

    @Test
    void testActualizarUsuario_emailYaRegistrado() {
        Usuario usuarioExistente = crearUsuario(1L, "actual@mail.com", "Luis", "Pérez", "123456789", "USER");
        UsuarioDTO dto = new UsuarioDTO();
        dto.setEmail("nuevo@mail.com");
        dto.setNombre("Luis");
        dto.setApellido("Pérez");
        dto.setTelefono("987654321");
        dto.setRolId(1L); // igual al actual para que no cambie

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.existsByEmail("nuevo@mail.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.actualizarUsuario(1L, dto));
        assertEquals("El email ya está registrado", ex.getMessage());
    }

    @Test
    void testActualizarUsuario_rolNoExiste() {
        Usuario usuarioExistente = crearUsuario(1L, "actual@mail.com", "Luis", "Pérez", "123456789", "USER");
        UsuarioDTO dto = new UsuarioDTO();
        dto.setEmail("actual@mail.com"); // para no cambiar email
        dto.setNombre("Luis");
        dto.setApellido("Pérez");
        dto.setTelefono("987654321");
        dto.setRolId(2L); // diferente para disparar búsqueda de rol

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(rolRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.actualizarUsuario(1L, dto));
        assertEquals("Rol no encontrado", ex.getMessage());
    }

    @Test
    void testEliminarUsuario_exito() {
        Usuario usuario = crearUsuario(1L, "usuario@mail.com", "Luis", "Pérez", "123456789", "USER");
        usuario.setActivo(true);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        usuarioService.eliminarUsuario(1L);

        assertFalse(usuario.isActivo());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void testEliminarUsuario_noEncontrado() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.eliminarUsuario(999L));
        assertEquals("Usuario no encontrado", ex.getMessage());
    }

}
