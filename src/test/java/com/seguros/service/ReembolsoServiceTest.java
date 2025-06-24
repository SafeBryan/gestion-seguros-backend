package com.seguros.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.ReembolsoRequestDTO;
import com.seguros.model.*;
import com.seguros.repository.ReembolsoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReembolsoServiceTest {

    @Mock
    private ReembolsoRepository reembolsoRepository;

    @Mock
    private ContratoService contratoService;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private ObjectMapper objectMapper;

    private ReembolsoService reembolsoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reembolsoService = new ReembolsoService(
                reembolsoRepository,
                contratoService,
                usuarioService,
                objectMapper
        );
    }



    private ReembolsoRequestDTO crearDTO() {
        ReembolsoRequestDTO dto = new ReembolsoRequestDTO();
        dto.setContratoId(1L);
        dto.setMonto(BigDecimal.valueOf(100.0)); // CORREGIDO
        dto.setDescripcion("Consulta médica");
        dto.setNombreMedico("Dr. House");
        dto.setMotivoConsulta("Dolor abdominal");
        dto.setCie10("K58");
        dto.setFechaAtencion(LocalDate.now());
        dto.setInicioSintomas(LocalDate.now().minusDays(2));
        dto.setEsAccidente(false);

        // CORREGIDO
        Map<String, String> archivos = new HashMap<>();
        archivos.put("factura.pdf", "uploads/reembolsos/factura.pdf");
        archivos.put("receta.jpg", "uploads/reembolsos/receta.jpg");
        dto.setArchivos(archivos);

        return dto;
    }


    private Usuario crearCliente() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        Rol rol = new Rol();
        rol.setNombre("CLIENTE");
        usuario.setRol(rol);
        return usuario;
    }

    private Usuario crearAprobador() {
        Usuario usuario = new Usuario();
        usuario.setId(2L);
        Rol rol = new Rol();
        rol.setNombre("ADMIN");
        usuario.setRol(rol);
        return usuario;
    }

    private Contrato crearContrato(Usuario cliente) {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setCliente(cliente);
        return contrato;
    }

    @Test
    void solicitarReembolso_valido_deberiaGuardarReembolso() throws Exception {
        ReembolsoRequestDTO dto = crearDTO();
        Usuario cliente = crearCliente();
        Contrato contrato = crearContrato(cliente);

        when(contratoService.obtenerContratoValido(dto.getContratoId())).thenReturn(contrato);
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);
        when(reembolsoRepository.save(any(Reembolso.class))).thenAnswer(inv -> inv.getArgument(0));
        doReturn("{\"factura.pdf\":\"uploads/reembolsos/factura.pdf\"}")
                .when(objectMapper).writeValueAsString(any());



        Reembolso result = reembolsoService.solicitarReembolso(dto, cliente.getId());

        assertEquals(dto.getDescripcion(), result.getDescripcion());
        assertEquals(dto.getMonto(), result.getMonto());
        assertNotNull(result.getArchivos());
    }

    @Test
    void solicitarReembolso_conContratoDeOtroCliente_lanzaExcepcion() {
        ReembolsoRequestDTO dto = crearDTO();
        Usuario cliente = crearCliente();
        Usuario otroCliente = new Usuario();
        otroCliente.setId(999L);

        Contrato contrato = crearContrato(otroCliente);

        when(contratoService.obtenerContratoValido(dto.getContratoId())).thenReturn(contrato);
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);

        Long clienteId = cliente.getId(); // EXTRAER AQUÍ

        assertThrows(RuntimeException.class, () ->
                reembolsoService.solicitarReembolso(dto, clienteId)
        );

    }

    @Test
    void procesarReembolso_aprobacionExitosa_deberiaGuardarReembolso() {
        Reembolso reembolso = new Reembolso();
        reembolso.setId(1L);
        Usuario aprobador = crearAprobador();

        when(reembolsoRepository.findById(1L)).thenReturn(Optional.of(reembolso));
        when(usuarioService.obtenerUsuario(aprobador.getId())).thenReturn(aprobador);

        reembolsoService.procesarReembolso(1L, aprobador.getId(), true, "Todo OK");

        verify(reembolsoRepository).save(reembolso);
    }

    @Test
    void procesarReembolso_porCliente_lanzaExcepcion() {
        Reembolso reembolso = new Reembolso();
        reembolso.setId(1L);
        Usuario cliente = crearCliente();

        when(reembolsoRepository.findById(1L)).thenReturn(Optional.of(reembolso));
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);

        Long clienteId = cliente.getId(); // EXTRAÍDO

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                reembolsoService.procesarReembolso(1L, clienteId, true, "No debería aprobar")
        );

        assertTrue(ex.getMessage().contains("no pueden aprobar"));
    }

    @Test
    void obtenerReembolsosPendientes_deberiaRetornarLista() {
        Reembolso r = new Reembolso();
        r.setEstado(Reembolso.EstadoReembolso.PENDIENTE);

        when(reembolsoRepository.findByEstado(Reembolso.EstadoReembolso.PENDIENTE))
                .thenReturn(List.of(r));

        List<Reembolso> result = reembolsoService.obtenerReembolsosPendientes();

        assertEquals(1, result.size());
    }

    @Test
    void buscarPorId_existente_deberiaRetornarOptional() {
        Reembolso r = new Reembolso();
        r.setId(99L);

        when(reembolsoRepository.findById(99L)).thenReturn(Optional.of(r));

        Optional<Reembolso> result = reembolsoService.buscarPorId(99L);
        assertTrue(result.isPresent());
    }
    @Test
    void solicitarReembolso_archivosNulos_noAsignaJson() {
        ReembolsoRequestDTO dto = crearDTO();
        dto.setArchivos(null); // <- Clave

        Usuario cliente = crearCliente();
        Contrato contrato = crearContrato(cliente);

        when(contratoService.obtenerContratoValido(dto.getContratoId())).thenReturn(contrato);
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);
        when(reembolsoRepository.save(any(Reembolso.class))).thenAnswer(inv -> inv.getArgument(0));

        Reembolso result = reembolsoService.solicitarReembolso(dto, cliente.getId());

        assertNull(result.getArchivos());
    }

    @Test
    void solicitarReembolso_esAccidenteNulo_esFalse() {
        ReembolsoRequestDTO dto = crearDTO();
        dto.setEsAccidente(null); // <- Clave

        Usuario cliente = crearCliente();
        Contrato contrato = crearContrato(cliente);

        when(contratoService.obtenerContratoValido(dto.getContratoId())).thenReturn(contrato);
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);
        when(reembolsoRepository.save(any(Reembolso.class))).thenAnswer(inv -> inv.getArgument(0));

        Reembolso result = reembolsoService.solicitarReembolso(dto, cliente.getId());

        assertFalse(result.getEsAccidente());
    }

    @Test
    void procesarReembolso_rechazo_deberiaGuardarReembolso() {
        Reembolso reembolso = mock(Reembolso.class); // usamos mock para verificar el método
        Usuario aprobador = crearAprobador();

        when(reembolsoRepository.findById(1L)).thenReturn(Optional.of(reembolso));
        when(usuarioService.obtenerUsuario(aprobador.getId())).thenReturn(aprobador);

        reembolsoService.procesarReembolso(1L, aprobador.getId(), false, "No cumple requisitos");

        verify(reembolso).rechazar(aprobador, "No cumple requisitos");
        verify(reembolsoRepository).save(reembolso);
    }

    @Test
    void obtenerReembolsosPorCliente_valido() {
        Usuario cliente = crearCliente();
        Reembolso r = new Reembolso();
        r.setId(10L);

        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);
        when(reembolsoRepository.findByContrato_Cliente(cliente)).thenReturn(List.of(r));

        List<Reembolso> reembolsos = reembolsoService.obtenerReembolsosPorCliente(cliente.getId());

        assertEquals(1, reembolsos.size());
    }
    @Test
    void solicitarReembolso_errorAlConvertirArchivos_lanzaExcepcion() throws Exception {
        ReembolsoRequestDTO dto = crearDTO();
        Usuario cliente = crearCliente();
        Contrato contrato = crearContrato(cliente);

        ObjectMapper mockMapper = mock(ObjectMapper.class);
        when(mockMapper.writeValueAsString(any())).thenThrow(new RuntimeException("Falla de JSON"));

        ReembolsoService service = new ReembolsoService(
                reembolsoRepository,
                contratoService,
                usuarioService,
                mockMapper
        );

        when(contratoService.obtenerContratoValido(dto.getContratoId())).thenReturn(contrato);
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);

        Long clienteId = cliente.getId(); // fuera de la lambda

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                service.solicitarReembolso(dto, clienteId)
        );


        assertTrue(ex.getMessage().contains("Error al convertir archivos a JSON"));
    }

    @Test
    void solicitarReembolso_esAccidenteTrue_deberiaEstablecerTrue() {
        ReembolsoRequestDTO dto = crearDTO();
        dto.setEsAccidente(true); // <- Clave

        Usuario cliente = crearCliente();
        Contrato contrato = crearContrato(cliente);

        when(contratoService.obtenerContratoValido(dto.getContratoId())).thenReturn(contrato);
        when(usuarioService.obtenerUsuario(cliente.getId())).thenReturn(cliente);
        when(reembolsoRepository.save(any(Reembolso.class))).thenAnswer(inv -> inv.getArgument(0));

        Reembolso result = reembolsoService.solicitarReembolso(dto, cliente.getId());

        assertTrue(result.getEsAccidente());
    }

    @Test
    void testConvertirADTO_Exitoso() throws Exception {
        Reembolso reembolso = new Reembolso();
        reembolso.setId(10L);
        reembolso.setMonto(BigDecimal.valueOf(150));
        reembolso.setDescripcion("Consulta");
        reembolso.setEstado(Reembolso.EstadoReembolso.APROBADO);
        reembolso.setComentarioRevisor("Revisión OK");
        reembolso.setFechaSolicitud(LocalDate.now().atStartOfDay());
        reembolso.setFechaRevision(LocalDate.now().plusDays(1).atStartOfDay());


        // Simular campos de relaciones
        Usuario cliente = new Usuario(); cliente.setId(1L); cliente.setNombre("Carlos");
        Usuario aprobador = new Usuario(); aprobador.setNombre("AgenteX");

        Seguro seguro = new SeguroVida(); seguro.setId(5L); seguro.setNombre("Plan Vida");
        Contrato contrato = new Contrato();
        contrato.setId(99L);
        contrato.setCliente(cliente);
        contrato.setSeguro(seguro);
        reembolso.setContrato(contrato);
        reembolso.setAprobadoPor(aprobador);

        // Simular JSON de archivos
        String archivosJson = "{\"factura.pdf\":\"ruta/factura.pdf\"}";
        reembolso.setArchivos(archivosJson);

        Map<String, String> archivosMap = Map.of("factura.pdf", "ruta/factura.pdf");
        when(objectMapper.readValue(archivosJson, Map.class)).thenReturn(archivosMap);

        var dto = reembolsoService.convertirADTO(reembolso);

        assertEquals(10L, dto.getId());
        assertEquals(BigDecimal.valueOf(150), dto.getMonto());
        assertEquals("Consulta", dto.getDescripcion());
        assertEquals("Plan Vida", dto.getSeguroNombre());
        assertEquals("Carlos", dto.getClienteNombre());
        assertEquals("AgenteX", dto.getAprobadoPorNombre());
        assertEquals("Revisión OK", dto.getComentarioRevisor());
        assertNotNull(dto.getArchivos());
        assertEquals("ruta/factura.pdf", dto.getArchivos().get("factura.pdf"));
    }
    @Test
    void testConvertirADTO_JsonInvalido() throws Exception {
        Reembolso reembolso = new Reembolso();
        reembolso.setId(20L);
        reembolso.setArchivos("json_malformado");

        when(objectMapper.readValue(anyString(), eq(Map.class))).thenThrow(new RuntimeException("Error de parseo"));

        var dto = reembolsoService.convertirADTO(reembolso);

        assertNull(dto.getArchivos()); // Debe caer en el catch y poner null
    }


}
