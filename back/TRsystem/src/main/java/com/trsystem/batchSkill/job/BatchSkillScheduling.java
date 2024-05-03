package com.trsystem.batchSkill.job;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.trsystem.batchSkill.service.BatchSkillService;

@Component
public class BatchSkillScheduling {
	
	private static final Logger logger = LoggerFactory.getLogger(BatchSkillScheduling.class);
	
	private final BatchSkillService batchSkillService;
	
	@Autowired
    public BatchSkillScheduling(BatchSkillService batchSkillService) {
        this.batchSkillService = batchSkillService;
    }
	
	@Scheduled(cron = "0 0 0 1 * ?") // 매달 1일 0시 0분 프로시저 실행
	public void executeEmpRetirePrcs() {
	    batchSkillService.executeEmpRetirePrcs();
	}
	
	@Scheduled(cron = "0 0 0 * * ?") // 매일 자정(0시) 배치 실행
	public void executeCostUpdate() {
		logger.info("배치 시작 at {} ",LocalDateTime.now());
		try {
			batchSkillService.executeCostUpdate();
			logger.info("배치 성공 at {} ", LocalDateTime.now());
		} catch(Exception e) {
			logger.error("배치 에러 :{} ", e.getMessage());
		}
	}

	@Scheduled(cron = "0 0 0 1 * *") // 매달 1일 배치 실행
	public void executeInsertCrtrDate() {
		logger.info("배치 시작 at {} ",LocalDateTime.now());
		try {
			batchSkillService.executeInsertCrtrDate();
			logger.info("배치 성공 at {} ", LocalDateTime.now());
		} catch(Exception e) {
			logger.error("배치 에러 :{} ", e.getMessage());
		}
	}
}
