package com.example.ai_recruiter.utils;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexUtils {

    // ------------------------
    // Extract Email
    // ------------------------
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");

    public static String extractEmail(String text) {
        Matcher matcher = EMAIL_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    // ------------------------
    // Extract Phone Number
    // Supports: +91 9876543210, 9876543210, (123)4567890 etc.
    // ------------------------
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("(\\+\\d{1,3}[- ]?)?\\d{10}");

    public static String extractPhone(String text) {
        Matcher matcher = PHONE_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    // ------------------------
    // Extract Skills List
    // Basic Example: Checks if skill words exist in text
    // You can expand this list as needed.
    // ------------------------

// ========================= SKILLS =========================

    private static String extractSkillsSection(String text) {

        // Normalize spaced headings like S K I L L S → SKILLS
        text = text.replaceAll("S\\s*K\\s*I\\s*L\\s*L\\s*S", "SKILLS");

        Pattern pattern = Pattern.compile(
                "(?i)SKILLS\\s*[:\\n-]*\\s*(.*?)(?=\\b(EDUCATION|EXPERIENCE|PROJECTS|INTERNSHIPS|CERTIFICATIONS|HOBBIES|DECLARATION)\\b|$)",
                Pattern.DOTALL
        );

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1);
        }

        return "";
    }



    private static String extractSection(String text, String sectionName) {

        Pattern pattern = Pattern.compile(
                "(?i)" + sectionName + "\\s*[:\\n-]*\\s*(.*?)" +
                        "(?=\\n\\s*(education|experience|projects|internships|certifications|skills|summary|profile|hobbies|declaration)\\b|$)",
                Pattern.DOTALL
        );

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1);
        }

        return "";
    }

    public static List<String> extractSkills(String text) {

        List<String> skills = new ArrayList<>();

        if (text == null || text.isBlank())
            return skills;

        text = text.replace("\r", "");

        // 🔥 1️⃣ Try Technical Skills format
        Pattern techSkillsPattern = Pattern.compile(
                "(?i)(Technical Skills|Skills|Core Skills|Key Skills)\\s*(.*?)(?=\\b(Academic Projects|Education|Experience|Projects|Internships|Certifications)\\b|$)",
                Pattern.DOTALL
        );

        Matcher techMatcher = techSkillsPattern.matcher(text);

        if (techMatcher.find()) {

            String block = techMatcher.group(2);

            block = block.replace("•", "\n");

            String[] lines = block.split("\\n|,");

            for (String line : lines) {
                addValidSkill(line, skills);
            }
        }

        // 🔥 2️⃣ Try Structured Subheading Format
        Pattern structuredPattern = Pattern.compile(
                "(?i)(Programming Languages|Frameworks/?Libraries|Databases|Developer Tools|Technologies|Academic Coursework)\\s*(.*?)(?=\\n[A-Z ]{3,}|Education|Experience|Projects|Internships|$)",
                Pattern.DOTALL
        );

        Matcher structuredMatcher = structuredPattern.matcher(text);

        while (structuredMatcher.find()) {

            String block = structuredMatcher.group(2);

            String[] tokens = block.split(",");

            for (String token : tokens) {
                addValidSkill(token, skills);
            }
        }

        return skills.stream().distinct().toList();
    }


    private static void addValidSkill(String input, List<String> skills) {

        String skill = input
                .replaceAll("[^a-zA-Z0-9+.#/\\- ]", "")
                .trim();

        if (skill.length() < 2 || skill.length() > 40)
            return;

        String lower = skill.toLowerCase();

        // Skip noise
        if (lower.matches(".*(expected|india|internship|completed|projects|education).*"))
            return;

        skills.add(skill);
    }
    // ------------------------ EXPERIENCE ------------------------
    // Handles:
    // 1.5 years, 1.3 yrs, 2-4 years, 3 to 5 years, 1 year, 6 months, etc.
// ========================= EXPERIENCE =========================
// ========================= EXPERIENCE =========================

    private static final Pattern EXP_PATTERN_1 =
            Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(years?|yrs?)", Pattern.CASE_INSENSITIVE);

    private static final Pattern EXP_PATTERN_2 =
            Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(years?|yrs?)\\s*(of)?\\s*experience", Pattern.CASE_INSENSITIVE);

    private static final Pattern EXP_PATTERN_3 =
            Pattern.compile("experience\\s*(of)?\\s*(\\d+(?:\\.\\d+)?)\\s*(years?|yrs?)", Pattern.CASE_INSENSITIVE);

    public static int extractExperience(String text) {
        text = text.toLowerCase();

        Matcher m1 = EXP_PATTERN_2.matcher(text);  // 3 years of experience
        if (m1.find()) {
            return (int) Double.parseDouble(m1.group(1));
        }

        Matcher m2 = EXP_PATTERN_3.matcher(text);  // experience of 3 years
        if (m2.find()) {
            return (int) Double.parseDouble(m2.group(2));
        }

        Matcher m3 = EXP_PATTERN_1.matcher(text);  // fallback → 3 years
        if (m3.find()) {
            return (int) Double.parseDouble(m3.group(1));
        }

        return 0;
    }




    // ------------------------ EDUCATION ------------------------
    // ========================= EDUCATION =========================

    private static final Pattern EDUCATION_PATTERN = Pattern.compile(
            "\\b(B\\.?Tech|B\\.?E|M\\.?Tech|M\\.?E|BCA|MCA|MBA|BSc|MSc|Diploma|" +
                    "Bachelor(?:'s)? Degree|Master(?:'s)? Degree|" +
                    "Bachelor of [A-Za-z ]+|Master of [A-Za-z ]+)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public static List<String> extractEducation(String text) {
        Matcher matcher = EDUCATION_PATTERN.matcher(text);
        List<String> degrees = new ArrayList<>();
        while (matcher.find()) {
            degrees.add(matcher.group());
        }
        return degrees;
    }

}

