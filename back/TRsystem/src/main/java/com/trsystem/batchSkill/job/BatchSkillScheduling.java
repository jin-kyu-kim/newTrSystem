package com.trsystem.batchSkill.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.trsystem.batchSkill.service.BatchSkillService;

@Component
public class SchedulingTest {
	
	private final BatchSkillService batchSkillService;
	
	@Autowired
    public SchedulingTest(BatchSkillService batchSkillService) {
        this.batchSkillService = batchSkillService;
    }
	
	@Scheduled(cron = "0 0 0 1 ? *") // 매달 1일 0시 0분 프로시저 실행
	public void executeEmpRetirePrcs() {
		batchSkillService.executeEmpRetirePrcs();
	}

}
