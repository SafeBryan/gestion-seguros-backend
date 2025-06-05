package com.seguros.service;

import com.seguros.dto.BeneficiarioDTO;
import com.seguros.dto.ContratoDTO;
import com.seguros.model.*;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
import io.qameta.allure.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContratoServiceTest {

    private ContratoService contratoService;
    private ContratoRepository contratoRepository;
    private UsuarioRepository usuarioRepository;
    private SeguroRepository seguroRepository;

    @BeforeEach
    void setUp() {
        contratoRepository = mock(ContratoRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        seguroRepository = mock(SeguroRepository.class);
        contratoService = new ContratoService(contratoRepository, usuarioRepository, seguroRepository);
    }

    private BeneficiarioDTO crearBeneficiarioDTO() {
        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setNombre("Hijo");
        dto.setParentesco("Familiar");
        dto.setPorcentaje(BigDecimal.valueOf(100));
        dto.setEsPrincipal(true);
        dto.setDocumentoIdentidad("12345678");
        dto.setEmail("hijo@test.com");
        dto.setTelefono("0999999999");
        dto.setFechaNacimiento(LocalDate.of(2010, 1, 1));
        return dto;
    }

    @Epic("Gestión de Contratos")
    @Feature("Creación de contratos")
    @Story("Contrato válido con beneficiarios")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("Debe crear contrato correctamente con cliente, agente y seguro")
    @Test
    void testCrearContrato() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);

        SeguroVida seguro = new SeguroVida();
        seguro.setId(3L);
        seguro.setNombre("Seguro Vida");

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.of(2025, 1, 1));
        dto.setFechaFin(LocalDate.of(2026, 1, 1));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.ANUAL);
        dto.setFirmaElectronica("firmaX");
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato contrato = contratoService.crearContrato(dto);

        assertEquals(cliente, contrato.getCliente());
        assertEquals(seguro, contrato.getSeguro());
        assertFalse(contrato.getBeneficiarios().isEmpty());
    }

    @Test
    void testCrearContratoConSeguroSalud() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);

        SeguroSalud seguro = new SeguroSalud();
        seguro.setId(4L);
        seguro.setNombre("Seguro Salud");
        seguro.setNumeroConsultasIncluidas(10);
        seguro.setHospitalesConvenio("Hospital Central");

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(4L);
        dto.setFechaInicio(LocalDate.of(2025, 2, 1));
        dto.setFechaFin(LocalDate.of(2026, 2, 1));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firmaSalud");
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO())); // ✅ necesario

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(4L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato contrato = contratoService.crearContrato(dto);

        assertEquals(seguro, contrato.getSeguro());
        assertTrue(contrato.getSeguro() instanceof SeguroSalud);
    }

    @Test
    void testCrearContrato_ClienteNoExiste() {
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(99L);
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.crearContrato(dto));

        assertEquals("Cliente no encontrado", ex.getMessage());
    }

    @Test
    void testCrearContrato_AgenteNoExiste() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.crearContrato(dto));

        assertEquals("Agente no encontrado", ex.getMessage());
    }

    @Test
    void testCrearContrato_SeguroNoExiste() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.crearContrato(dto));

        assertEquals("Seguro no encontrado", ex.getMessage());
    }

    @Test
    void testActualizarEstado() {
        Contrato contrato = new Contrato();
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(contratoRepository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato actualizado = contratoService.actualizarEstado(1L, Contrato.EstadoContrato.CANCELADO);

        assertEquals(Contrato.EstadoContrato.CANCELADO, actualizado.getEstado());
    }

    @Test
    void testActualizarEstado_ContratoNoExiste() {
        when(contratoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.actualizarEstado(1L, Contrato.EstadoContrato.ACTIVO));

        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    void testObtenerContratoValido() {
        Contrato contrato = new Contrato();
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));

        Contrato result = contratoService.obtenerContratoValido(1L);

        assertEquals(Contrato.EstadoContrato.ACTIVO, result.getEstado());
    }

    @Test
    void testObtenerContratoValido_ContratoNoExiste() {
        when(contratoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.obtenerContratoValido(1L));

        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    void testObtenerContratoValido_ContratoInactivo() {
        Contrato contrato = new Contrato();
        contrato.setEstado(Contrato.EstadoContrato.CANCELADO);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.obtenerContratoValido(1L));

        assertEquals("El contrato no está activo", ex.getMessage());
    }

    @Test
    void testConvertirAContratoDTO() {
        // Setup contrato con datos básicos
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        Rol rolAgente = new Rol(); rolAgente.setId(3L); rolAgente.setNombre("ADMIN");
        agente.setRol(rolAgente);
        SeguroVida seguro = new SeguroVida(); seguro.setId(4L); seguro.setNombre("Seguro Vida");

        Contrato contrato = new Contrato();
        contrato.setId(10L);
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusMonths(6));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contrato.setArchivos("{\"doc1\":\"url1\"}");

        // Beneficiarios
        Beneficiario b = new Beneficiario();
        b.setId(1L);
        b.setNombre("Beneficiario Uno");
        b.setParentesco("Hijo");
        b.setPorcentaje(BigDecimal.valueOf(100));
        b.setEsPrincipal(true);
        b.setDocumentoIdentidad("111");
        b.setEmail("b1@test.com");
        b.setTelefono("0999999999");
        b.setFechaNacimiento(LocalDate.of(2000, 1, 1));
        b.setContrato(contrato);
        contrato.setBeneficiarios(List.of(b));

        ContratoDTO dto = contratoService.convertirAContratoDTO(contrato);

        assertEquals(10L, dto.getId());
        assertEquals(1L, dto.getClienteId());
        assertEquals(2L, dto.getAgenteId());
        assertEquals(4L, dto.getSeguroId());
        assertNotNull(dto.getAgente());
        assertEquals("ADMIN", dto.getAgente().getRolNombre());
        assertEquals(1, dto.getBeneficiarios().size());
        assertEquals("Beneficiario Uno", dto.getBeneficiarios().get(0).getNombre());
    }

    @Test
    void testActualizarContrato() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        SeguroVida seguro = new SeguroVida(); seguro.setId(3L);
        Rol rol = new Rol(); rol.setId(4L); rol.setNombre("ADMIN");
        agente.setRol(rol);

        Contrato contrato = new Contrato();
        contrato.setId(5L);
        contrato.setEstado(Contrato.EstadoContrato.CANCELADO);
        contrato.setBeneficiarios(new java.util.ArrayList<>());

        when(contratoRepository.findById(5L)).thenReturn(Optional.of(contrato));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusMonths(6));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.ANUAL);
        dto.setEstado(Contrato.EstadoContrato.CANCELADO);
        dto.setFirmaElectronica("actualizada");
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        Contrato actualizado = contratoService.actualizarContrato(5L, dto);

        assertEquals("actualizada", actualizado.getFirmaElectronica());
        assertEquals(1, actualizado.getBeneficiarios().size());
    }

    @Test
    void testObtenerContratosPorCliente() {
        Contrato contrato = new Contrato();
        when(contratoRepository.findContratosActivosPorCliente(1L)).thenReturn(List.of(contrato));

        List<Contrato> result = contratoService.obtenerContratosPorCliente(1L);
        assertEquals(1, result.size());
    }
    @Test
    void testObtenerContratosPorVencer() {
        Contrato contrato = new Contrato();
        when(contratoRepository.findContratosPorVencer(any())).thenReturn(List.of(contrato));

        List<Contrato> result = contratoService.obtenerContratosPorVencer(15);
        assertEquals(1, result.size());
    }

    @Test
    void testCrearContratoSinBeneficiarios_LanzaExcepcion() {
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setBeneficiarios(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            contratoService.crearContrato(dto);
        });

        assertEquals("Debe agregar al menos un beneficiario para crear el contrato.", ex.getMessage());
    }

    @Test
    void testCrearContrato_BeneficiariosNulos_LanzaExcepcion() {
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setBeneficiarios(null); // <-- caso específico

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            contratoService.crearContrato(dto);
        });

        assertEquals("Debe agregar al menos un beneficiario para crear el contrato.", ex.getMessage());
    }

    @Test
    void testCrearContrato_BeneficiariosVacios_LanzaExcepcion() {
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setBeneficiarios(List.of()); // <-- vacío

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            contratoService.crearContrato(dto);
        });

        assertEquals("Debe agregar al menos un beneficiario para crear el contrato.", ex.getMessage());
    }

    @Test
    void testCrearContrato_ConArchivos() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        Seguro seguro = new SeguroVida(); seguro.setId(3L);

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusMonths(6));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firma");
        dto.setArchivos(Map.of("doc", "url"));
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato contrato = contratoService.crearContrato(dto);

        assertTrue(contrato.getArchivos().contains("doc"));
    }

    @Test
    void testObtenerContratosPorVencer_FechaLimiteCorrecta() {
        Contrato contrato = new Contrato();
        when(contratoRepository.findContratosPorVencer(any())).thenReturn(List.of(contrato));

        List<Contrato> result = contratoService.obtenerContratosPorVencer(15);

        assertEquals(1, result.size());
        verify(contratoRepository).findContratosPorVencer(any(LocalDate.class));
    }

    @Test
    void testConvertirAContratoDTO_ConArchivosYBeneficiarios() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusDays(30));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma");
        contrato.setArchivos("{\"doc\":\"url\"}");

        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L); agente.setActivo(true);

        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ADMIN");
        rol.setDescripcion("desc");
        agente.setRol(rol);

        contrato.setCliente(cliente);
        contrato.setAgente(agente);

        Seguro seguro = new SeguroVida(); seguro.setId(3L); seguro.setNombre("Seguro Vida");
        contrato.setSeguro(seguro);

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setId(1L);
        beneficiario.setNombre("Ben");
        beneficiario.setContrato(contrato);
        contrato.setBeneficiarios(List.of(beneficiario));

        ContratoDTO dto = contratoService.convertirAContratoDTO(contrato);

        assertEquals(1L, dto.getId());
        assertNotNull(dto.getArchivos());
        assertEquals("url", dto.getArchivos().get("doc"));
        assertEquals(1, dto.getBeneficiarios().size());
        assertEquals("Ben", dto.getBeneficiarios().get(0).getNombre());
    }
    @Test
    void testActualizarContrato_ConArchivosYMultiplesBeneficiarios() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setEstado(Contrato.EstadoContrato.CANCELADO);
        contrato.setBeneficiarios(new java.util.ArrayList<>());

        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);

        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ADMIN");
        rol.setDescripcion("desc");
        agente.setRol(rol);

        Seguro seguro = new SeguroVida(); seguro.setId(3L);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firmaActualizada");
        dto.setEstado(Contrato.EstadoContrato.CANCELADO);
        dto.setArchivos(Map.of("pdf", "ruta.pdf"));
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        Contrato actualizado = contratoService.actualizarContrato(1L, dto);

        assertEquals("firmaActualizada", actualizado.getFirmaElectronica());
        assertEquals(1, actualizado.getBeneficiarios().size());
        assertNotNull(actualizado.getArchivos());
        assertTrue(actualizado.getArchivos().contains("pdf"));
    }

    @Test
    void testCrearContrato_EstadoNullAsignaActivo() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        Seguro seguro = new SeguroVida(); seguro.setId(3L);

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firma");
        dto.setEstado(null); // <- clave
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato contrato = contratoService.crearContrato(dto);

        assertEquals(Contrato.EstadoContrato.ACTIVO, contrato.getEstado());
    }
    @Test
    void testConvertirAContratoDTO_ArchivosJsonInvalido() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setCliente(new Usuario()); contrato.getCliente().setId(1L);

        Usuario agente = new Usuario(); agente.setId(2L);
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ADMIN");
        rol.setDescripcion("admin rol");
        agente.setRol(rol);
        contrato.setAgente(agente);

        contrato.setSeguro(new SeguroVida()); contrato.getSeguro().setId(3L);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusDays(30));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma");

        contrato.setArchivos("invalid-json:::");

        contratoService.convertirAContratoDTO(contrato);
    }


    @Test
    void testConvertirAContratoDTO_ConBeneficiariosYArchivos() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setCliente(new Usuario()); contrato.getCliente().setId(1L);
        contrato.setAgente(new Usuario()); contrato.getAgente().setId(2L);
        contrato.getAgente().setRol(new Rol()); contrato.getAgente().getRol().setId(1L); contrato.getAgente().getRol().setNombre("ADMIN");
        contrato.setSeguro(new SeguroVida()); contrato.getSeguro().setId(3L); contrato.getSeguro().setNombre("Seg");
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusDays(30));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma");
        contrato.setArchivos("{\"doc\":\"url\"}");

        Beneficiario b = new Beneficiario();
        b.setId(1L);
        b.setNombre("Ben");
        contrato.setBeneficiarios(List.of(b));

        ContratoDTO dto = contratoService.convertirAContratoDTO(contrato);

        assertEquals("Ben", dto.getBeneficiarios().get(0).getNombre());
        assertEquals("url", dto.getArchivos().get("doc"));
    }

    @Test
    void testConvertirAContratoDTO_AgenteYSeguroNoNulos() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        Rol rol = new Rol(); rol.setId(1L); rol.setNombre("ADMIN");
        agente.setRol(rol);
        agente.setActivo(true);
        contrato.setAgente(agente);

        SeguroVida seguro = new SeguroVida(); seguro.setId(3L); seguro.setNombre("Vida");
        contrato.setSeguro(seguro);

        contrato.setCliente(new Usuario()); contrato.getCliente().setId(1L);
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusMonths(1));
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma");

        contratoService.convertirAContratoDTO(contrato);
    }

    @Test
    void testActualizarContrato_EstadoEditableSiNoActivo() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setEstado(Contrato.EstadoContrato.CANCELADO);
        contrato.setBeneficiarios(new java.util.ArrayList<>());

        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        Seguro seguro = new SeguroVida(); seguro.setId(3L);
        agente.setRol(new Rol()); agente.getRol().setId(1L); agente.getRol().setNombre("ADMIN");

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        dto.setEstado(Contrato.EstadoContrato.CANCELADO); // <- asegura que no es null
        dto.setBeneficiarios(List.of(crearBeneficiarioDTO()));

        Contrato actualizado = contratoService.actualizarContrato(1L, dto);

        assertEquals(Contrato.EstadoContrato.CANCELADO, actualizado.getEstado());
    }


}
