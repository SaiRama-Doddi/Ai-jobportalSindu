package com.example.ai_recruiter.service;


import com.example.ai_recruiter.dto.ApplicationResponse;
import com.example.ai_recruiter.dto.CreateJobRequest;
import com.example.ai_recruiter.dto.JobResponse;
import com.example.ai_recruiter.entity.*;
import com.example.ai_recruiter.repo.ApplicationRepository;
import com.example.ai_recruiter.repo.JobRepository;
import com.example.ai_recruiter.repo.ResumeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserService userService;
    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;

    private int extractExperienceFromResume(Resume resume) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> map =
                    mapper.readValue(resume.getParsedJson(), Map.class);

            Object exp = map.get("experience");

            if (exp instanceof Integer) {
                return (Integer) exp;
            }

            if (exp instanceof Number) {
                return ((Number) exp).intValue();
            }

            return 0;

        } catch (Exception e) {
            return 0;
        }
    }

    public List<JobResponse> getRecommendedJobsForCandidate() {

        User candidate = userService.getCurrentUser();

        Optional<Resume> optionalResume =
                resumeRepository.findTopByCandidateOrderByUploadedAtDesc(candidate);

        // If no resume → show all jobs
        if (optionalResume.isEmpty()) {
            return jobRepository.findAll()
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        Resume resume = optionalResume.get();

        // 🔥 Get candidate experience
        int candidateExp = extractExperienceFromResume(resume);

        // 🔥 Filter jobs by experience
        List<Job> eligibleJobs = jobRepository.findAll()
                .stream()
                .filter(j -> j.getMinExperience() <= candidateExp)
                .toList();

        // If no eligible jobs → show all jobs
        if (eligibleJobs.isEmpty()) {
            return jobRepository.findAll()
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        // 🔥 Now match skills ONLY within eligible jobs
        List<String> skillsList = extractSkillsFromResume(resume);

        if (skillsList.isEmpty()) {
            return eligibleJobs.stream()
                    .map(this::toResponse)
                    .toList();
        }

        String[] skillsArray = skillsList.toArray(new String[0]);

        List<Job> matchedJobs =
                jobRepository.findJobsMatchingSkills(skillsArray)
                        .stream()
                        .filter(eligibleJobs::contains)
                        .toList();

        if (matchedJobs.isEmpty()) {
            return eligibleJobs.stream()
                    .map(this::toResponse)
                    .toList();
        }

        return matchedJobs.stream()
                .map(this::toResponse)
                .toList();
    }


    public List<String> extractSkillsFromResume(Resume resume){
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String,Object> map = mapper.readValue(resume.getParsedJson(), Map.class);
            List<String> raw = (List<String>) map.getOrDefault("skills", List.of());

            return raw.stream()
                    .flatMap(line -> Arrays.stream(
                            line.toLowerCase()
                                    .replaceAll("[^a-z0-9+#./ ]", "")
                                    .split("\\s+|,|/")
                    ))
                    .filter(s -> s.length() > 2)
                    .distinct()
                    .toList();

        } catch (Exception e){
            return List.of();
        }
    }


    public JobResponse createJob(CreateJobRequest request){
        User hr=userService.getCurrentUser();

        Job job=Job.builder()
                .hr(hr)
                .title(request.getTitle())
                .description(request.getDescription())
                .requiredSkills((request.getRequiredSkills()))
                .minExperience(request.getMinExperience())
                .createdAt(Instant.now())
                .build();
        Job saved=jobRepository.save(job);
        return toResponse(saved);

    }

    //fetch hr created jobs
    public List<JobResponse> getJobsByCurrentHr(){
        User hr=userService.getCurrentUser();
        return jobRepository.findByHr(hr).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

    }


    public Job getJobId(Long id){
        return jobRepository.findById(id).orElseThrow(()->new RuntimeException("Job not found"+id));
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    private JobResponse toResponse(Job job){
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requiredSkills((job.getRequiredSkills()))
                .minExperience(job.getMinExperience())
                .createdAt(job.getCreatedAt())
                .build();
    }

    public JobResponse updateJob(Long jobId, CreateJobRequest request) {
        User hr = userService.getCurrentUser();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getHr().getId().equals(hr.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setMinExperience(request.getMinExperience());

        return toResponse(jobRepository.save(job));
    }

    public void deleteJob(Long jobId) {
        User hr = userService.getCurrentUser();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getHr().getId().equals(hr.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        jobRepository.delete(job);
    }

    public List<ApplicationResponse> getCandidatesForJob(Long jobId) {
        return applicationRepository.findCandidatesWithInterviewer(jobId);
    }

    private List<String> matchResumeWithJobSkills(String resumeText, List<String> jobSkills) {
        resumeText = resumeText.toLowerCase();
        List<String> matched = new ArrayList<>();

        for (String skill : jobSkills) {
            String cleaned = skill.toLowerCase().replaceAll("[^a-z0-9+.# ]", "");
            if (resumeText.contains(cleaned)) {
                matched.add(skill);
            }
        }
        return matched;
    }

    private int calculateScore(List<String> jobSkills, List<String> matchedSkills) {
        if (jobSkills.isEmpty()) return 0;
        return (matchedSkills.size() * 100) / jobSkills.size();
    }



}
