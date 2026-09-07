package io.kvnbbg.pdfcv;

import java.util.List;

public record CvPayload(
    String type,
    String version,
    String source,
    String subject,
    String context,
    List<String> skills,
    List<String> domains,
    List<String> evidence
) {}
