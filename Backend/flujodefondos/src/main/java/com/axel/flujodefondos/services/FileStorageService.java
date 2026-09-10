package com.axel.flujodefondos.services;

import org.springframework.beans.factory.annotation.Value;
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

    private final Path basePath;

    public FileStorageService(@Value("${app.storage.base-path:./}") String basePath) {
        this.basePath = Paths.get(basePath).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file, String subDir, String oldUrl) {
        try {
            Path dir = Files.createDirectories(basePath.resolve(subDir));

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
            return "/" + subDir + "/" + path.getFileName();
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo", e);
        }
    }

    @SuppressWarnings("null")
    public Resource loadAsResource(String subDir, String filename) {
        try {
            Resource resource = new UrlResource(basePath.resolve(subDir).resolve(filename).toUri());
            return resource.exists() ? resource : null;
        } catch (Exception e) {
            return null;
        }
    }

    public String getContentType(String subDir, String filename) {
        try {
            String type = Files.probeContentType(basePath.resolve(subDir).resolve(filename));
            return type != null ? type : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}