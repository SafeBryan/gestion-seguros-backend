package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.model.Seguro.TipoSeguro;
import com.seguros.service.SeguroService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SeguroController.class)
class SeguroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeguroService seguroService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCrearSeguro() throws Exception {
        SeguroDTO dto = new SeguroDTO();
        Seguro seguro = new Seguro();

        // Mock de la creación del seguro
        Mockito.when(seguroService.crearSeguro(any(SeguroDTO.class))).thenReturn(seguro);

        // Petición POST para crear un seguro
        mockMvc.perform(post("/api/seguros")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))  // Convierte el DTO a JSON
                .andExpect(status().isOk());  // Verifica el código de estado 200 OK
    }

    @Test
    void testObtenerSegurosActivos() throws Exception {
        List<Seguro> lista = Arrays.asList(new Seguro(), new Seguro());
        // Mock de la obtención de seguros activos
        Mockito.when(seguroService.obtenerSegurosActivos()).thenReturn(lista);

        // Petición GET para obtener todos los seguros activos
        mockMvc.perform(get("/api/seguros"))
                .andExpect(status().isOk())  // Verifica el código de estado 200 OK
                .andExpect(jsonPath("$.length()").value(2));  // Verifica que el tamaño del array es 2
    }

    @Test
    void testObtenerPorTipo() throws Exception {
        TipoSeguro tipo = TipoSeguro.VIDA;
        List<Seguro> lista = Arrays.asList(new Seguro());
        // Mock de la obtención de seguros por tipo
        Mockito.when(seguroService.obtenerSegurosPorTipo(tipo)).thenReturn(lista);

        // Petición GET para obtener seguros por tipo
        mockMvc.perform(get("/api/seguros/tipo/" + tipo))
                .andExpect(status().isOk())  // Verifica el código de estado 200 OK
                .andExpect(jsonPath("$.length()").value(1));  // Verifica que el tamaño del array es 1
    }

    @Test
    void testActualizarEstado() throws Exception {
        Seguro seguro = new Seguro();
        // Mock de la actualización del estado de un seguro
        Mockito.when(seguroService.actualizarEstado(eq(1L), eq(true))).thenReturn(seguro);

        // Petición PUT para actualizar el estado del seguro con ID 1
        mockMvc.perform(put("/api/seguros/1/estado")
                .param("activo", "true"))  // Parametro 'activo' es true
                .andExpect(status().isOk());  // Verifica el código de estado 200 OK
    }
}
