package com.careersetu.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class ResumeTextExtractor {

    public String extract(MultipartFile file) throws IOException {
        String name = file.getOriginalFilename() != null
                ? file.getOriginalFilename().toLowerCase() : "";

        try (InputStream is = file.getInputStream()) {
            if (name.endsWith(".pdf")) {
                try (PDDocument doc = PDDocument.load(is)) {
                    return new PDFTextStripper().getText(doc);
                }
            } else if (name.endsWith(".docx")) {
                try (XWPFDocument doc = new XWPFDocument(is);
                     XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                    return extractor.getText();
                }
            } else {
                throw new IllegalArgumentException(
                        "Unsupported file type. Please upload your resume as PDF or DOCX. " +
                        "(Photo uploads aren't supported yet — please export your resume as a PDF.)");
            }
        }
    }
}