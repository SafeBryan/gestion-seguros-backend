package com.seguros.service;

import com.seguros.dto.DependienteDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Dependiente;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.DependienteRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DependienteServiceTest {

    @Mock
    private DependienteRepository dependienteRepository;

    @Mock
    private ContratoRepository contratoRepository;

    @InjectMocks
    private DependienteService dependienteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private DependienteDTO crearDTO() {
        DependienteDTO dto = new DependienteDTO();
        dto.setContratoId(1L);
        dto.setNombre("Pedro");
        dto.setParentesco("Hijo");
        dto.setDocumentoIdentidad("1100110011");
        dto.setEmail("pedro@example.com");
        dto.setTelefono("0987654321");
        dto.setFechaNacimiento(LocalDate.of(2010, 5, 10));
        return dto;
    }

    private Contrato crearContrato() {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        return contrato;
    }

    @Test
    void crearDependiente_conContratoExistente_deberiaGuardarDependiente() {
        DependienteDTO dto = crearDTO();
        Contrato contrato = crearContrato();

        when(contratoRepository.findById(dto.getContratoId())).thenReturn(Optional.of(contrato));
        when(dependienteRepository.save(any(Dependiente.class))).thenAnswer(invocation -> {
            Dependiente d = invocation.getArgument(0);
            d.setId(1L);
            return d;
        });

        Dependiente result = dependienteService.crearDependiente(dto);

        assertNotNull(result);
        assertEquals("Pedro", result.getNombre());
        assertEquals(1L, result.getContrato().getId());
        verify(dependienteRepository).save(any(Dependiente.class));
    }

    @Test
    void crearDependiente_conContratoNoExistente_lanzaExcepcion() {
        DependienteDTO dto = crearDTO();
        when(contratoRepository.findById(dto.getContratoId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> dependienteService.crearDependiente(dto));
        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    void actualizarDependientes_deberiaEliminarYCrearTodos() {
        DependienteDTO dto1 = crearDTO();
        DependienteDTO dto2 = crearDTO();
        dto2.setNombre("Lucía");
        List<DependienteDTO> lista = List.of(dto1, dto2);

        Contrato contrato = crearContrato();

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(dependienteRepository.save(any(Dependiente.class))).thenAnswer(invocation -> {
            Dependiente d = invocation.getArgument(0);
            d.setId(new Random().nextLong());
            return d;
        });

        List<Dependiente> dependientes = dependienteService.actualizarDependientes(1L, lista);

        assertEquals(2, dependientes.size());
        verify(dependienteRepository).deleteAllByContratoId(1L);
        verify(dependienteRepository, times(2)).save(any(Dependiente.class));
    }

    @Test
    void obtenerPorContrato_deberiaRetornarListaDependientes() {
        Dependiente d1 = new Dependiente();
        d1.setNombre("Pedro");
        d1.setId(1L);
        d1.setContrato(crearContrato());

        when(dependienteRepository.findByContratoId(1L)).thenReturn(List.of(d1));

        List<Dependiente> resultado = dependienteService.obtenerPorContrato(1L);

        assertEquals(1, resultado.size());
        assertEquals("Pedro", resultado.get(0).getNombre());
    }
}
