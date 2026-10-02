package com.tncolleges.platform.service;

import com.tncolleges.platform.dto.CollegeMediaResponse;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.CollegeMedia;
import com.tncolleges.platform.repository.CollegeMediaRepository;
import com.tncolleges.platform.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class CollegeMediaService {
    private static final long MAX_IMAGE_BYTES = 8L * 1024 * 1024;
    private final CollegeMediaRepository mediaRepository;
    private final CollegeRepository collegeRepository;
    private final Path storageDirectory;

    public CollegeMediaService(CollegeMediaRepository mediaRepository,
                               CollegeRepository collegeRepository,
                               @Value("${app.media.storage-dir:data/college-media}") String storageDirectory) {
        this.mediaRepository = mediaRepository;
        this.collegeRepository = collegeRepository;
        this.storageDirectory = Path.of(storageDirectory).toAbsolutePath().normalize();
    }

    @Transactional
    public CollegeMediaResponse upload(Long collegeId, MultipartFile file, String uploadedBy) {
        College college = collegeRepository.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Choose an image to upload");
        if (file.getSize() > MAX_IMAGE_BYTES) throw new IllegalArgumentException("Image must be 8 MB or smaller");

        final byte[] bytes;
        try { bytes = file.getBytes(); }
        catch (IOException exception) { throw new IllegalArgumentException("Could not read the uploaded image"); }
        ImageType imageType = detectImageType(bytes);
        String storedName = UUID.randomUUID() + imageType.extension();
        Path destination = storageDirectory.resolve(String.valueOf(collegeId)).resolve(storedName).normalize();
        if (!destination.startsWith(storageDirectory)) throw new IllegalArgumentException("Invalid upload path");

        try {
            Files.createDirectories(destination.getParent());
            Files.write(destination, bytes, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not store the uploaded image", exception);
        }

        String originalName = safeOriginalName(file.getOriginalFilename());
        try {
            CollegeMedia media = mediaRepository.save(CollegeMedia.builder()
                    .college(college)
                    .originalName(originalName)
                    .storedName(storedName)
                    .contentType(imageType.contentType())
                    .size(bytes.length)
                    .uploadedBy(uploadedBy)
                    .createdAt(LocalDateTime.now())
                    .build());
            return CollegeMediaResponse.from(media);
        } catch (RuntimeException exception) {
            try { Files.deleteIfExists(destination); } catch (IOException ignored) { }
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public List<CollegeMediaResponse> listForCollege(Long collegeId) {
        requireRegisteredCollege(collegeId);
        return mediaRepository.findAllByCollege_IdOrderByCreatedAtDesc(collegeId).stream()
                .map(CollegeMediaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Long getCollegeId(Long mediaId) {
        return mediaRepository.findById(mediaId).map(item -> item.getCollege().getId())
                .orElseThrow(() -> new NoSuchElementException("Image not found"));
    }

    @Transactional(readOnly = true)
    public MediaFile open(Long mediaId, boolean managerAccess) {
        CollegeMedia media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new NoSuchElementException("Image not found"));
        College college = media.getCollege();
        boolean publicAsset = college.isRegistered() && college.isActive() && college.isVerified();
        if (!managerAccess && !publicAsset) throw new NoSuchElementException("Image not found");
        Path file = resolveStoredFile(media);
        if (!Files.isRegularFile(file)) throw new NoSuchElementException("Image file not found");
        try {
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) throw new NoSuchElementException("Image file not found");
            return new MediaFile(resource, media.getContentType(), media.getOriginalName(), publicAsset);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not read the image", exception);
        }
    }

    @Transactional
    public void delete(Long collegeId, Long mediaId) {
        CollegeMedia media = mediaRepository.findByIdAndCollege_Id(mediaId, collegeId)
                .orElseThrow(() -> new NoSuchElementException("Image not found for this college"));
        Path file = resolveStoredFile(media);
        mediaRepository.delete(media);
        try { Files.deleteIfExists(file); }
        catch (IOException exception) { throw new IllegalStateException("Image record was deleted, but the stored file could not be removed", exception); }
    }

    private College requireRegisteredCollege(Long collegeId) {
        return collegeRepository.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }

    private Path resolveStoredFile(CollegeMedia media) {
        Path file = storageDirectory.resolve(String.valueOf(media.getCollege().getId()))
                .resolve(media.getStoredName()).normalize();
        if (!file.startsWith(storageDirectory)) throw new IllegalStateException("Invalid stored media path");
        return file;
    }

    private String safeOriginalName(String original) {
        if (original == null || original.isBlank()) return "college-image";
        String name = original.replace('\\', '/');
        name = name.substring(name.lastIndexOf('/') + 1).replaceAll("[^a-zA-Z0-9._ -]", "_").trim();
        if (name.isBlank()) name = "college-image";
        return name.length() > 255 ? name.substring(name.length() - 255) : name;
    }

    private ImageType detectImageType(byte[] bytes) {
        if (bytes.length >= 8 && (bytes[0] & 0xff) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4e && bytes[3] == 0x47
                && bytes[4] == 0x0d && bytes[5] == 0x0a && bytes[6] == 0x1a && bytes[7] == 0x0a) return ImageType.PNG;
        if (bytes.length >= 3 && (bytes[0] & 0xff) == 0xff && (bytes[1] & 0xff) == 0xd8 && (bytes[2] & 0xff) == 0xff) return ImageType.JPEG;
        if (bytes.length >= 12 && ascii(bytes, 0, 4).equals("RIFF") && ascii(bytes, 8, 12).equals("WEBP")) return ImageType.WEBP;
        throw new IllegalArgumentException("Only valid JPEG, PNG, or WebP image files are supported");
    }

    private String ascii(byte[] bytes, int start, int end) {
        return new String(bytes, start, end - start, java.nio.charset.StandardCharsets.US_ASCII);
    }

    private enum ImageType {
        JPEG("image/jpeg", ".jpg"), PNG("image/png", ".png"), WEBP("image/webp", ".webp");
        private final String contentType;
        private final String extension;
        ImageType(String contentType, String extension) { this.contentType = contentType; this.extension = extension; }
        String contentType() { return contentType; }
        String extension() { return extension; }
    }

    public record MediaFile(Resource resource, String contentType, String originalName, boolean publicAsset) { }
}
