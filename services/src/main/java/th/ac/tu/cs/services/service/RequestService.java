package th.ac.tu.cs.services.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import th.ac.tu.cs.services.model.Request;
import th.ac.tu.cs.services.repository.RequestRepository;

import java.util.List;

@Service
public class RequestService {
    @Autowired
    private RequestRepository repository;

    //Student
    public Request getRequestById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Request> getRequestsByStudentId(String studentId) {
        return repository.findByStudentId(studentId);
    }

    public Request createRequest(Request request) {
        request.setStatus("PENDING");
        Request savedRequest = repository.save(request);

        return savedRequest;
    }

    //Employee
    public List<Request> getAllRequests() {
        return repository.findAll();
    }

    public Request updateRequestStatus(Long id, String status, String details) {
        Request request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        request.setDetails(details);
        Request updatedRequest = repository.save(request);


        return updatedRequest;
    }
}
