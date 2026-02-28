    package com.example.ai_recruiter.controller;

    import com.example.ai_recruiter.entity.Resume;
    import com.example.ai_recruiter.service.ResumeService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    @RestController
    @RequestMapping("/api/resumes")
    @RequiredArgsConstructor
    public class ResumeController {

        private final ResumeService resumeService;

        @PostMapping(
                value = "/upload",
                consumes = "multipart/form-data"
        )
        public ResponseEntity<?> uploadResume(
                @RequestParam("file") MultipartFile file
        ) throws Exception {
            resumeService.handleUpload(file);
            return ResponseEntity.ok().build();
        }


        @GetMapping("/my")
        public ResponseEntity<?> getMyResume() {
            return ResponseEntity.ok(resumeService.getResumeForCurrentUser());
        }

        @GetMapping("/view/{resumeId}")
        public ResponseEntity<byte[]> viewResume(@PathVariable Long resumeId) throws Exception {

            Resume resume = resumeService.getResume(resumeId);
            byte[] decryptedFile = resumeService.decryptResume(resume);

            // Detect file type (PDF, DOCX, etc.)
            String contentType = resumeService.detectMimeType(decryptedFile);

            return ResponseEntity.ok()
                    .header("Content-Disposition",
                            "inline; filename=\"" + resume.getFileName() + "\"")
                    .header("Content-Type", contentType)
                    .body(decryptedFile);
        }


        @GetMapping("/download/{resumeId}")
        public ResponseEntity<byte[]> downloadResume(@PathVariable Long resumeId) throws Exception {

            Resume resume = resumeService.getResume(resumeId);
            byte[] decryptedFile = resumeService.decryptResume(resume);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/octet-stream")
                    .header("Content-Disposition",
                            "attachment; filename=\"" + resume.getFileName() + "\"")
                    .body(decryptedFile);
        }



    }
