package com.seguros.service;

import com.seguros.dto.BeneficiarioDTO;
import com.seguros.model.Beneficiario;
import com.seguros.model.Contrato;
import com.seguros.repository.BeneficiarioRepository;
import com.seguros.repository.ContratoRepository;
import io.qameta.allure.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Epic("Gestión de Beneficiarios")
@Feature("Servicio de Beneficiarios")
class BeneficiarioServiceTest {

    private BeneficiarioService beneficiarioService;
    private BeneficiarioRepository beneficiarioRepository;
    private ContratoRepository contratoRepository;

    @BeforeEach
    void setUp() {
        beneficiarioRepository = mock(BeneficiarioRepository.class);
        contratoRepository = mock(ContratoRepository.class);
        beneficiarioService = new BeneficiarioService(beneficiarioRepository, contratoRepository);
    }

    private BeneficiarioDTO crearDTO() {
        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setContratoId(1L);
        dto.setNombre("Juan");
        dto.setParentesco("Hijo");
        dto.setPorcentaje(BigDecimal.valueOf(40));
        dto.setEsPrincipal(true);
        dto.setDocumentoIdentidad("12345678");
        dto.setEmail("juan@test.com");
        dto.setTelefono("0999999999");
        dto.setFechaNacimiento(LocalDate.of(2010, 1, 1));
        return dto;
    }

    @Story("Creación de beneficiario")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("Debe crear un beneficiario correctamente")
    @Test
    void testCrearBeneficiario_Exitoso() {
        BeneficiarioDTO dto = crearDTO();
        Contrato contrato = new Contrato();
        contrato.setId(1L);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(beneficiarioRepository.sumPorcentajeByContratoId(1L)).thenReturn(BigDecimal.valueOf(40));
        when(beneficiarioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Beneficiario result = beneficiarioService.crearBeneficiario(dto);

        assertEquals("Juan", result.getNombre());
        assertEquals("Hijo", result.getParentesco());
        assertEquals(contrato, result.getContrato());
    }

    @Test
    @DisplayName("Debe lanzar excepción si contrato no existe")
    void testCrearBeneficiario_ContratoNoExiste() {
        BeneficiarioDTO dto = crearDTO();

        when(contratoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            beneficiarioService.crearBeneficiario(dto);
        });

        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    @DisplayName("Debe lanzar excepción si porcentaje supera 100%")
    void testCrearBeneficiario_SumaPorcentajeExcede100() {
        BeneficiarioDTO dto = crearDTO();
        dto.setPorcentaje(BigDecimal.valueOf(80)); // Total: 50 + 80 = 130
        Contrato contrato = new Contrato(); contrato.setId(1L);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(beneficiarioRepository.sumPorcentajeByContratoId(1L)).thenReturn(BigDecimal.valueOf(50));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            beneficiarioService.crearBeneficiario(dto);
        });

        assertEquals("La suma de porcentajes no puede exceder el 100%", ex.getMessage());
    }

    @Test
    @DisplayName("Debe actualizar beneficiarios correctamente si suman 100%")
    void testActualizarBeneficiarios_Exitoso() {
        BeneficiarioDTO dto1 = crearDTO();
        dto1.setPorcentaje(BigDecimal.valueOf(60));

        BeneficiarioDTO dto2 = crearDTO();
        dto2.setNombre("Maria");
        dto2.setPorcentaje(BigDecimal.valueOf(40));

        // Mock del contrato requerido
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));

        when(beneficiarioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        List<Beneficiario> result = beneficiarioService.actualizarBeneficiarios(1L, List.of(dto1, dto2));

        assertEquals(2, result.size());
        assertEquals("Juan", result.get(0).getNombre());
        assertEquals("Maria", result.get(1).getNombre());
    }


    @Test
    @DisplayName("Debe lanzar excepción si suma de beneficiarios no es 100%")
    void testActualizarBeneficiarios_SumaNo100() {
        BeneficiarioDTO dto = crearDTO(); // 40%

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            beneficiarioService.actualizarBeneficiarios(1L, List.of(dto));
        });

        assertEquals("La suma total de porcentajes debe ser exactamente 100%", ex.getMessage());
    }

    @Test
    @DisplayName("Debe obtener beneficiarios por contrato")
    void testObtenerPorContrato() {
        Beneficiario b = new Beneficiario();
        when(beneficiarioRepository.findByContratoId(1L)).thenReturn(List.of(b));

        List<Beneficiario> result = beneficiarioService.obtenerPorContrato(1L);

        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Debe obtener beneficiarios por cliente")
    void testObtenerPorCliente() {
        Beneficiario b = new Beneficiario();
        when(beneficiarioRepository.findByClienteId(1L)).thenReturn(List.of(b));

        List<Beneficiario> result = beneficiarioService.obtenerPorCliente(1L);

        assertEquals(1, result.size());
    }
}
