package th.ac.tu.cs.services.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import th.ac.tu.cs.services.model.Request;
import th.ac.tu.cs.services.service.RequestService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/requests")
public class RequestController {
    @Autowired
    private RequestService service;

    //Student
    @GetMapping("/my-requests") //ขอฟอร์มของนักศึกษาคนนั้น
    public List<Request> getMyRequests(@RequestHeader("studentId") String studentId) {
        return service.getRequestsByStudentId(studentId);
    }

    @GetMapping("/{id}") //ขอฟอร์ม
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Request request = service.getRequestById(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/create") //นำข้อมูลลง
    public ResponseEntity<Request> createRequest(@RequestBody Request request) {
        Request savedRequest = service.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
    }

    //Employee
    @GetMapping("/all-requests") //ดูคำร้องจากทุกคน
    public List<Request> getAllRequests() {
        return service.getAllRequests();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, Object> statusUpdateRequest) {
        try {
            String status = (String) statusUpdateRequest.get("status");
            String details = (String) statusUpdateRequest.get("details");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Request request = service.updateRequestStatus(id, status, details);

            return ResponseEntity.ok(request);
        } catch (Exception e) {
            // แสดงรายละเอียดของข้อผิดพลาด
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
