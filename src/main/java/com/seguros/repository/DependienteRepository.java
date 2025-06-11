package com.seguros.repository;

import com.seguros.model.Dependiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface DependienteRepository extends JpaRepository<Dependiente, Long> {

    List<Dependiente> findByContratoId(Long contratoId);

    @Transactional
    void deleteAllByContratoId(Long contratoId);
}
