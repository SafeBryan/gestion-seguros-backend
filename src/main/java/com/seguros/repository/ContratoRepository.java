package com.seguros.repository;

import com.seguros.model.Contrato;
import com.seguros.model.Usuario;
import io.qameta.allure.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    List<Contrato> findByCliente(Usuario cliente);
    List<Contrato> findByAgente(Usuario agente);
    List<Contrato> findBySeguroId(Long seguroId);

    @Query("SELECT c FROM Contrato c WHERE c.cliente.id = :clienteId")
    List<Contrato> findAllByClienteId(Long clienteId);

    @Query("SELECT c FROM Contrato c WHERE c.fechaFin BETWEEN :hoy AND :fechaLimite AND c.estado = 'ACTIVO'")
    List<Contrato> findContratosPorVencer(@Param("hoy") LocalDate hoy, @Param("fechaLimite") LocalDate fechaLimite);

    @Query("SELECT c FROM Contrato c WHERE c.cliente.id = :clienteId AND c.estado = 'ACTIVO'")
    List<Contrato> findContratosActivosPorCliente(Long clienteId);

    @Query("SELECT c FROM Contrato c LEFT JOIN c.pagos p WHERE p IS NULL")
    List<Contrato> findContratosImpagos();

    List<Contrato> findByFechaFinBeforeAndEstado(LocalDate fecha, Contrato.EstadoContrato estado);





}