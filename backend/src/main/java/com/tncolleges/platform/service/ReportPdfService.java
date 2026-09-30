package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.Report;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Generates a compact one-page PDF snapshot without an external binary/PDF dependency. */
@Service
public class ReportPdfService {
    private final ObjectMapper mapper;

    public ReportPdfService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public byte[] generate(Report report) {
        List<String> lines = new ArrayList<>();
        lines.add("College interest report");
        lines.add("College ID: " + report.getCollegeId());
        lines.add("Report type: " + safe(report.getReportType()));
        lines.add("Period: " + safe(report.getPeriod()));
        lines.add("Generated: " + report.getGeneratedAt());
        lines.add("");
        try {
            Map<String, Object> data = mapper.readValue(report.getBreakdownJson(), new TypeReference<Map<String, Object>>() {});
            int included = 0;
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                if (included++ >= 36) {
                    lines.add("Additional report details are available in the saved report data.");
                    break;
                }
                String value = safe(String.valueOf(entry.getValue()));
                if (value.length() > 110) value = value.substring(0, 107) + "...";
                lines.add(label(entry.getKey()) + ": " + value);
            }
        } catch (Exception exception) {
            lines.add("Report data is unavailable.");
        }
        return render(lines);
    }

    private byte[] render(List<String> lines) {
        StringBuilder stream = new StringBuilder("BT\n/F1 16 Tf\n50 790 Td\n");
        boolean title = true;
        for (String line : lines) {
            if (title) {
                stream.append("(").append(escape(safe(line))).append(") Tj\n/F1 10 Tf\n0 -28 Td\n");
                title = false;
            } else {
                stream.append("(").append(escape(safe(line))).append(") Tj\n0 -16 Td\n");
            }
        }
        stream.append("ET\n");
        byte[] content = stream.toString().getBytes(StandardCharsets.US_ASCII);
        List<byte[]> objects = List.of(
                bytes("<< /Type /Catalog /Pages 2 0 R >>"),
                bytes("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
                bytes("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"),
                bytes("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
                concat(bytes("<< /Length " + content.length + " >>\nstream\n"), content, bytes("endstream"))
        );
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        List<Integer> offsets = new ArrayList<>();
        write(output, bytes("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n"));
        for (int i = 0; i < objects.size(); i++) {
            offsets.add(output.size());
            write(output, bytes((i + 1) + " 0 obj\n"));
            write(output, objects.get(i));
            write(output, bytes("\nendobj\n"));
        }
        int xrefOffset = output.size();
        write(output, bytes("xref\n0 " + (objects.size() + 1) + "\n0000000000 65535 f \n"));
        for (Integer offset : offsets) write(output, bytes(String.format(Locale.ROOT, "%010d 00000 n \n", offset)));
        write(output, bytes("trailer\n<< /Size " + (objects.size() + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF"));
        return output.toByteArray();
    }

    private static byte[] bytes(String text) {
        return text.getBytes(StandardCharsets.ISO_8859_1);
    }

    private static byte[] concat(byte[]... parts) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        for (byte[] part : parts) write(output, part);
        return output.toByteArray();
    }

    private static void write(ByteArrayOutputStream output, byte[] bytes) {
        try { output.write(bytes); } catch (IOException impossible) { throw new IllegalStateException(impossible); }
    }

    private String safe(String value) {
        if (value == null) return "";
        return value.replaceAll("[^\\x20-\\x7E]", "?");
    }

    private String escape(String value) {
        return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)");
    }

    private String label(String value) {
        String spaced = value.replace('_', ' ');
        return spaced.isEmpty() ? spaced : Character.toUpperCase(spaced.charAt(0)) + spaced.substring(1);
    }
}
