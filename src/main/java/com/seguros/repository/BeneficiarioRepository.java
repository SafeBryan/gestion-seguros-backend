package com.seguros.repository;

import com.seguros.model.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface BeneficiarioRepository extends JpaRepository<Beneficiario, Long> {

    List<Beneficiario> findByContratoId(Long contratoId);

    @Query("SELECT SUM(b.porcentaje) FROM Beneficiario b WHERE b.contrato.id = :contratoId")
    BigDecimal sumPorcentajeByContratoId(Long contratoId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Beneficiario b WHERE b.contrato.id = :contratoId")
    void deleteAllByContratoId(Long contratoId);

    @Query("SELECT b FROM Beneficiario b WHERE b.contrato.cliente.id = :clienteId")
    List<Beneficiario> findByClienteId(Long clienteId);
}