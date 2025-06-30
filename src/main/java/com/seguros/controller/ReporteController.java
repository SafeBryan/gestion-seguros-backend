package com.seguros.controller;

import com.seguros.dto.ContratoDTO;
import com.seguros.dto.ReembolsoResponseDTO;
import com.seguros.model.Reembolso;
import com.seguros.service.ContratoService;
import com.seguros.service.ReembolsoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ContratoService contratoService;
    private final ReembolsoService reembolsoService;

    public ReporteController(ContratoService contratoService, ReembolsoService reembolsoService) {
        this.contratoService = contratoService;
        this.reembolsoService = reembolsoService;
    }

    @GetMapping("/seguros-impagos")
    public List<ContratoDTO> getSegurosImpagos() {
        return contratoService.obtenerContratosImpagos();
    }

    @GetMapping("/contratos-por-cliente/{id}")
    public List<ContratoDTO> getContratosPorCliente(@PathVariable Long id) {
        return contratoService.obtenerContratosPorCliente(id).stream()
                .map(contratoService::convertirAContratoDTO)
                .toList();
    }

    @GetMapping("/reembolsos-pendientes")
    public List<ReembolsoResponseDTO> getReembolsosPendientes() {
        List<Reembolso> pendientes = reembolsoService.obtenerReembolsosPendientes();
        return pendientes.stream().map(reembolsoService::convertirADTO).toList();
    }

    @GetMapping("/contratos-vencidos")
    public List<ContratoDTO> getVencidos() {
        return contratoService.obtenerContratosVencidos();
    }

    @GetMapping("/contratos-por-vencer")
    public List<ContratoDTO> getPorVencer() {
        return contratoService.obtenerContratosPorVencer();
    }
}

