package com.seguros.repository;

import com.seguros.model.Contrato;
import com.seguros.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    List<Contrato> findByCliente(Usuario cliente);
    List<Contrato> findByAgente(Usuario agente);
    List<Contrato> findBySeguroId(Long seguroId);

    @Query("SELECT c FROM Contrato c WHERE c.estado = 'ACTIVO' AND c.fechaFin BETWEEN CURRENT_DATE AND :fechaLimite")
    List<Contrato> findContratosPorVencer(LocalDate fechaLimite);

    @Query("SELECT c FROM Contrato c WHERE c.cliente.id = :clienteId AND c.estado = 'ACTIVO'")
    List<Contrato> findContratosActivosPorCliente(Long clienteId);
}