package th.ac.tu.cs.services.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import th.ac.tu.cs.services.model.Request;
import th.ac.tu.cs.services.service.RequestService;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    @PostMapping("/create")
    public ResponseEntity<Request> createRequest(
            @RequestParam("request") String requestJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            System.out.println("Received request JSON: " + requestJson);

            // แปลง JSON เป็น Request object
            ObjectMapper objectMapper = new ObjectMapper();
            Request request = objectMapper.readValue(requestJson, Request.class);
            System.out.println("Parsed Request Object: " + request);

            // จัดการไฟล์
            if (file != null) {
                System.out.println("Received file: " + file.getOriginalFilename());

                String directoryPath = "upload";
                Path uploadPath = Paths.get(directoryPath);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                    System.out.println("Created upload directory: " + directoryPath);
                }

                String filePath = directoryPath + "/" + file.getOriginalFilename();
                Path path = Paths.get(filePath);
                Files.write(path, file.getBytes());
                System.out.println("File saved at: " + filePath);

                request.setFilePath(filePath);
            } else {
                System.out.println("No file received.");
            }

            // บันทึกในฐานข้อมูล
            Request savedRequest = service.createRequest(request);
            System.out.println("Saved Request in database: " + savedRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);

        } catch (Exception e) {
            System.err.println("Error during request creation:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        try {
            // รับ Request ตาม id ที่กำหนด
            Request request = service.getRequestById(id);
            if (request == null || request.getFilePath() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // ดึงไฟล์ตามที่อยู่ที่เก็บไว้
            Path filePath = Paths.get(request.getFilePath());
            byte[] fileContent = Files.readAllBytes(filePath);

            // กำหนดชื่อไฟล์จากที่เก็บไว้
            String originalFileName = filePath.getFileName().toString();

            // กำหนด Content-Disposition ให้ใช้ชื่อไฟล์ตรงกับชื่อจริงของไฟล์
            ContentDisposition contentDisposition = ContentDisposition
                    .attachment()
                    .filename(originalFileName)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF); // กำหนด MIME type ให้เป็น PDF (ปรับตามประเภทไฟล์)
            headers.setContentDisposition(contentDisposition); // ตั้งค่า Content-Disposition ด้วยชื่อไฟล์ตรงๆ

            // ส่งกลับ Response พร้อมไฟล์
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
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
