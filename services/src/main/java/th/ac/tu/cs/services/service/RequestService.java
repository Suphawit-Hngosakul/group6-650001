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

    @Autowired
    private EmailService emailService;

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

        // ส่งอีเมลแจ้งนักศึกษา
        String subject = "คำร้องของคุณได้รับการส่งแล้ว";
        String text = "Dear " + request.getStudentName() + ",\n\nคำร้องของคุณถูกส่งเรียบร้อยแล้ว "
                + "เราจะดำเนินการให้เร็วๆนี้\n\nThank you.";
        emailService.sendEmail(request.getEmail(), subject, text);

        return savedRequest;
    }

    //Employee
    public List<Request> getAllRequests() {
        return repository.findAll();
    }

    public Request updateRequestStatus(Long id, String status, String details, String employeename) {
        Request request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        request.setDetails(details);
        request.setEmployeename(employeename);
        Request updatedRequest = repository.save(request);

        // ส่งอีเมลแจ้งนักศึกษาเมื่อสถานะเปลี่ยน
        String subject = "สถานะคำร้องของคุณมีการเปลี่ยนแปลง";
        String text = "Dear " + request.getStudentName() + ",\n\nสถานะคำขอของคุณได้มีการเปลี่ยนแปลงเป็น: "
                + status + ".\nรายละเอียดเพิ่มเติม: " + details
                +"โดย"+ employeename +"\n\nThank you.";
        emailService.sendEmail(request.getEmail(), subject, text);

        return updatedRequest;
    }
}
