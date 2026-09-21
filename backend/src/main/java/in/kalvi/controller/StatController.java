package in.kalvi.controller;

import in.kalvi.model.DistrictStat;
import in.kalvi.repo.StatRepo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatController {

    private final StatRepo stats;
    public StatController(StatRepo stats) { this.stats = stats; }

    @GetMapping("/districts")
    public List<DistrictStat> districts() {
        return stats.findAll();
    }
}
