package com.seguros.repository;

import com.seguros.model.Seguro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeguroRepository extends JpaRepository<Seguro, Long> {
    List<Seguro> findByActivoTrue();
}
