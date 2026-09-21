package in.kalvi.controller;

import in.kalvi.model.AisheStat;
import in.kalvi.model.DistrictStat;
import in.kalvi.repo.AisheRepo;
import in.kalvi.repo.StatRepo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatController {

    private final StatRepo stats;
    private final AisheRepo aishe;

    public StatController(StatRepo stats, AisheRepo aishe) { this.stats = stats; this.aishe = aishe; }

    @GetMapping("/districts")
    public List<DistrictStat> districts() {
        return stats.findAll();
    }

    /* AISHE 2023-24 — Tamil Nadu official higher-education overview */
    @GetMapping("/aishe")
    public Map<String, Object> aishe() {
        List<AisheStat> rows = aishe.findAllByOrderByCollegeCountDesc();
        int total = rows.stream().mapToInt(r -> r.collegeCount).sum();
        return Map.of("year", "2023–24",
                "source", "AISHE — All India Survey on Higher Education (MoE, Govt. of India)",
                "total", total == 0 ? 2983 : total,
                "cats", rows);
    }
}
