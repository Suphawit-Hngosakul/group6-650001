package th.ac.tu.cs.services.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import th.ac.tu.cs.services.model.Request;
import th.ac.tu.cs.services.service.RequestService;

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
            // แปลงข้อมูล JSON ไปเป็น Request object
            ObjectMapper objectMapper = new ObjectMapper();
            Request request = objectMapper.readValue(requestJson, Request.class);

            // บันทึกไฟล์ถ้ามีการแนบมา
            if (file != null) {
                String directoryPath = "upload"; // เส้นทางโฟลเดอร์ upload
                Path uploadPath = Paths.get(directoryPath);

                // สร้างโฟลเดอร์ upload ถ้าไม่มี
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // บันทึกไฟล์
                String filePath = directoryPath + "/" + file.getOriginalFilename();
                Path path = Paths.get(filePath);
                Files.write(path, file.getBytes());

                // เก็บที่อยู่ไฟล์ใน request
                request.setFilePath(filePath);
            }

            // บันทึก request ลงฐานข้อมูล
            Request savedRequest = service.createRequest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);

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
            String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");

            // กำหนดประเภทของไฟล์
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (originalFileName.endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            } else if (originalFileName.endsWith(".docx")) {
                mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            } else if (originalFileName.endsWith(".xlsx")) {
                mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
            // เพิ่มประเภทไฟล์อื่น ๆ ตามที่ต้องการ

            // สร้าง headers สำหรับการดาวน์โหลดไฟล์
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.add("Content-Disposition", String.format("attachment; filename=\"%s\"; filename*=UTF-8''%s", originalFileName, encodedFileName));

            // ส่งกลับ Response พร้อมไฟล์
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
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
