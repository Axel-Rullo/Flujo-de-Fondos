package com.axel.flujodefondos.controllers;

import com.axel.flujodefondos.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping("/Profiles/{filename:.+}")
    public ResponseEntity<Resource> serveProfilePhoto(@PathVariable String filename) {
        Resource resource = fileStorageService.loadAsResource("Profiles", filename);
        if (resource != null) {
            String contentType = fileStorageService.getContentType("Profiles", filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }
}
