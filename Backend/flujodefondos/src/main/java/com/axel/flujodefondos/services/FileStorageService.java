package com.axel.flujodefondos.services;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");

    public String store(MultipartFile file, String subDir, String oldUrl) {
        try {
            Path dir = Files.createDirectories(root.resolve(subDir));

            if (oldUrl != null && !oldUrl.isBlank()) {
                Files.deleteIfExists(dir.resolve(oldUrl.substring(oldUrl.lastIndexOf('/') + 1)));
            }

            String name = file.getOriginalFilename();
            if (name == null || name.isBlank()) name = "file";

            int dot = name.lastIndexOf('.');
            String base = dot > 0 ? name.substring(0, dot) : name;
            String ext = dot > 0 ? name.substring(dot) : "";

            int count = 0;
            Path path;
            do {
                path = dir.resolve(base + (count == 0 ? "" : count) + ext);
                count++;
            } while (Files.exists(path));

            Files.write(path, file.getBytes());
            return "/api/uploads/" + subDir + "/" + path.getFileName();
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo", e);
        }
    }

    @SuppressWarnings("null")
    public Resource loadAsResource(String subDir, String filename) {
        try {
            Resource resource = new UrlResource(root.resolve(subDir).resolve(filename).toAbsolutePath().toUri());
            return resource.exists() ? resource : null;
        } catch (Exception e) {
            return null;
        }
    }

    public String getContentType(String subDir, String filename) {
        try {
            String type = Files.probeContentType(root.resolve(subDir).resolve(filename));
            return type != null ? type : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}
