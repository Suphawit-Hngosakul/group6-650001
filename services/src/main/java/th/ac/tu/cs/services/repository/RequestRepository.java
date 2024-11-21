package th.ac.tu.cs.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import th.ac.tu.cs.services.model.Request;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByStudentId(String studentId);
}
