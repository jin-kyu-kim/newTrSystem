package com.trsystem.email.service;

import java.net.InetAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.mail.javamail.JavaMailSender;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.trsystem.common.service.CommonServiceImpl;

@Service
public class EmailSendService {

	private JavaMailSender emailSender;
	private CommonServiceImpl serviceImpl;

	@Autowired
	public EmailSendService(JavaMailSender emailSender, CommonServiceImpl serviceImpl) {
		this.emailSender = emailSender;
		this.serviceImpl = serviceImpl;
	}
	
	
	/**
	 * 프로젝트 결재 이메일 전송폼
	 * @param toEmpId		- 결재자 id
	 * @param reportEmpId	- 기안자 id
	 * @param projectCode	- 프로젝트 코드
	 * @param title			- 제목(project 명)
	 * @param content		- 내용
	 * @param submitType	-실행원가인지 ,변경원가인지 (VTW01502-실행,VTW01503-변경)
	 * @Param state 		-(""=승인요청,approval=승인,reject="반려")
	 */
	public void projectEmailSend(String toEmpId, String reportEmpId, String projectCode, String title, String content,  String submitType ,String state) {
		
		if(!toEmpId.isEmpty() && !toEmpId.equals(null)) {
			//============================결재자 email 세팅===================================
			List<Map<String, Object>> toEmp = DataFind(toEmpId,"EMP"); // 프로젝트 결재자 email
			Map<String, Object> toEmpData = toEmp.get(0);
			String toEmpEmail = extractEmail(toEmpData);
			//============================기안자 email 세팅===================================
			List<Map<String, Object>> reportEmp = DataFind(reportEmpId,"EMP"); // 프로젝트 결재 기안자 email
			Map<String, Object> reportEmpData = reportEmp.get(0);
			String reportEmpEmail = extractEmail(reportEmpData);
			
			String moveUrl =getCompleteUrl("/project/ProjectAprvDetail","");
			String subject = "[VTW 프로젝트결재]";
			
			switch(submitType) {
			case "VTW01502" :
				subject += "실행원가-"+title;
			break;
			case "VTW01503" :
				subject += "변경원가-"+title;
			break;
			}
			
			String emailContent = "<div style='margin: 0px; padding: 0px; border: 0px; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; font-size: 15px; line-height: inherit; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web (West European)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, sans-serif; vertical-align: baseline; color: rgb(32, 31, 30); background-color: rgb(67, 108, 153);'>"
					+ "<h2 style='padding: 15px 0px 0px 15px; font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 14px; line-height: 1em; font-family: dotum; color: rgb(255, 255, 255);'>"
					+ content
					+ "</h2>"
					+ "<div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'>"
					+ "프로젝트코드 : " + projectCode
					+ "<span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span></span><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'>"
					+ "작성자 : ("+(String)reportEmpData.get("empno")+") "+(String)reportEmpData.get("empFlnm");
			
			if (state == null || state.isEmpty()) {
				emailContent = emailContent 
						+ "<span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'><br></span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>[바로가기] 를 클릭하면 해당문서로 이동합니다.</span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>(TR 시스템에 로그인되어 있어야 합니다.)</span></span></div></div><div style='margin: 6px 0px 0px 15px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 12px; line-height: 1em; font-family: dotum; vertical-align: baseline; color: rgb(85, 85, 85);'><br></div>\r\n"
						+ "<span style=\"color: rgb(85, 85, 85); font-family: dotum; font-size: 12px; font-weight: 700;\">&nbsp;"
						+ "</span><a href=\""+moveUrl+"\" target=\"_blank\" rel=\"noopener noreferrer\" data-auth=\"NotApplicable\" style=\"margin: 0px 0px 5px; padding: 4.14623px 10.3726px; border: 1px solid rgb(0, 137, 200); font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 13px; line-height: 1em; font-family: dotum; vertical-align: baseline; display: inline-block; color: rgb(255, 255, 255); text-align: center; background-color: rgb(67, 108, 153); border-radius: 3px; white-space: nowrap;\">바로가기</a>";	
			}
			
			//이메일전송
			if((toEmpEmail == "" ? null : toEmpEmail) != null) {
				try {
					emailSend(toEmpEmail, subject, emailContent);
				} catch (MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			
		}
	}
	

	
	
	/**
	 * 전자결재 이메일 전송폼
	 * @param toEmpId			//결재자
	 * @param reportEmpId		//기안자
	 * @param documentNumber	//전자결재 문서번호
	 * @param title				//제목
	 * @param content			//내용
	 * @param pageMove
	 * @param moveUrl
	 **/
	public void elecAtrzEmailSend(String toEmpId, String reportEmpId, String documentNumber, String title, String content, boolean pageMove, String moveUrl) {
		
		if(!toEmpId.isEmpty() && !toEmpId.equals(null)) {
			// 전자 결재 이메일 전송폼
			//============================결재자 email 세팅===================================
			List<Map<String, Object>> toEmp = DataFind(toEmpId,"EMP"); // 프로젝트 결재자 email
			Map<String, Object> toEmpData = toEmp.get(0);
			String toEmpEmail = extractEmail(toEmpData);
			//============================기안자 email 세팅===================================
			List<Map<String, Object>> reportEmp = DataFind(reportEmpId,"EMP"); // 프로젝트 결재 기안자 email
			Map<String, Object> reportEmpData = reportEmp.get(0);
			String reportEmpEmail = extractEmail(reportEmpData);

			 
			
			String subject = "[VTW 전자결재] '"+title; 
			String emailContent = "<div style='margin: 0px; padding: 0px; border: 0px; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; font-size: 15px; line-height: inherit; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web (West European)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, sans-serif; vertical-align: baseline; color: rgb(32, 31, 30); background-color: rgb(67, 108, 153);'>"
					+ "<h2 style='padding: 15px 0px 0px 15px; font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 14px; line-height: 1em; font-family: dotum; color: rgb(255, 255, 255);'>"
					+ content
					+ "</h2>"
					+ "<div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'>"
					+ "문서 번호 : " + documentNumber
					+ "<span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span></span><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'>"
					+ "| 작성자 : ("+(String)reportEmpData.get("empno")+") "+(String)reportEmpData.get("empFlnm");
			
			if(pageMove) {
				//============================URL 세팅=========================================
				String detailMoveUrl = getCompleteUrl(moveUrl,documentNumber);
				emailContent = emailContent 
						+ "<span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'><br></span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>[바로가기] 를 클릭하면 해당문서로 이동합니다.</span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>(TR 시스템에 로그인되어 있어야 합니다.)</span></span></div></div><div style='margin: 6px 0px 0px 15px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 12px; line-height: 1em; font-family: dotum; vertical-align: baseline; color: rgb(85, 85, 85);'><br></div>\r\n"
						+ "<span style=\"color: rgb(85, 85, 85); font-family: dotum; font-size: 12px; font-weight: 700;\">&nbsp;"
						+ "</span><a href=\""+detailMoveUrl+"\" target=\"_blank\" rel=\"noopener noreferrer\" data-auth=\"NotApplicable\" style=\"margin: 0px 0px 5px; padding: 4.14623px 10.3726px; border: 1px solid rgb(0, 137, 200); font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 13px; line-height: 1em; font-family: dotum; vertical-align: baseline; display: inline-block; color: rgb(255, 255, 255); text-align: center; background-color: rgb(67, 108, 153); border-radius: 3px; white-space: nowrap;\">바로가기</a>";	
				
			}
			//이메일전송
			if((toEmpEmail == "" ? null : toEmpEmail) != null) {
				try {
					emailSend(toEmpEmail, subject, emailContent);
				} catch (MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			
		}
	}
	
	
	
	/**
	 * 관리자 비용 업로드 이메일 전송폼
	 * @param expenseEmpId		
	 * @param sessionEmpId	//로그인 사원ID
	 * @param originalFilename
	 * @param title			//이메일 제목
	 * @param content		//이메일 내용

	 */
	public void emailSendExpenseExcelForm(String expenseEmpId, String sessionEmpId, String originalFilename, String title, String content) {
		if(!expenseEmpId.isEmpty() && !expenseEmpId.equals(null)) {
			// 관리자 비용 업로드 이메일 전송폼
			//============================결재자 email 세팅===================================
			List<Map<String, Object>> toEmp = DataFind(expenseEmpId,"EMP"); // 프로젝트 결재자 email
			Map<String, Object> toEmpData = toEmp.get(0);
			String toEmpEmail = extractEmail(toEmpData);
			//============================기안자 email 세팅===================================
			List<Map<String, Object>> reportEmp = DataFind(sessionEmpId,"EMP"); // 프로젝트 결재 기안자 email
			Map<String, Object> reportEmpData = reportEmp.get(0);
			String reportEmpEmail = extractEmail(reportEmpData);
			
			
			String subject = "[VTW 비용 엑셀 업로드] " + title;
			String emailContent = content+ "| 업로드자 : ("+sessionEmpId+") "+reportEmpData.get("empFlnm");
			
			//이메일전송
			if((toEmpEmail == "" ? null :toEmpEmail) != null) {
				try {
					emailSend(toEmpEmail, subject, emailContent);
				} catch (MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}			
		}
	}
	

	/**
	 * 회의실 예약 이메일 전송폼
	 * 
	 * @param reserveEmpId - 예약자 id
	 * @param attendEmpId  - 참석자 ID (List<String>)
	 * @param state        - 동작상태	(등록Insert,수정update,삭제cancel)
	 * @param startTime    - 시작일자 + 사용시작시분 (USE_YMD + USE_BGNG_HM)
	 * @param endTime      - 시작일자 + 사용종료시분 (USE_YMD + USE_END_HM)
	 * @param content      - 회의 제목 (MTG_TTL)
	 * @param roomNm       - 회의실 코드 (MTG_ROOM_CD)
	 **/
	public void roomReserveEmailSend(String reserveEmpId, List<String> attendEmpId, String state, String startTime,String endTime, String content, String roomNm) {
		
		 //============================예약자 및 참석자 email 세팅===================================
		List<Map<String, Object>> reserveEmp = DataFind(reserveEmpId,"EMP"); // 회의 예약자 정보
		Map<String, Object> reserveEmpData = reserveEmp.get(0);
		String reservEmpEmail = extractEmail(reserveEmpData);
		
		 //============================예약된 회의실 명칭===========================================
		String room = "";
		List<Map<String, Object>> RoomCd = DataFind(roomNm,"CD");
		Map<String, Object> reservRoomNmData = RoomCd.get(0);
		Object roomObj = reservRoomNmData.get("cdNm");
		if (roomObj instanceof String) {
			 room = (String) roomObj;
		}
		//============================시간 포매팅================================================
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
	    LocalDateTime startDate = LocalDateTime.parse(startTime, formatter);
	    LocalDateTime endDate = LocalDateTime.parse(endTime, formatter);
	    DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
	    String formattedStartDate = startDate.format(outputFormatter);
	    String formattedEndDate = endDate.format(outputFormatter);
	    
	  //============================분기에 따른 제목 설정===========================================
		String subject = "[VTW 회의실 예약]";
		String moveUrl =  getCompleteUrl("/humanResourceMng/MeetingRoomManage","");
		
		String title = "";
		switch (state) { // 회의실 예약 상태에 따른 분기 처리
		case "insert":// 등록
			title = "회의 참석 안내";
			subject += " " + title;
			break;
		case "update": // 수정
			title = "회의 예약 수정 안내";
			subject += " " + title;
			break;
		case "cancel":// 취소
			title = "회의 예약 취소 안내";
			subject += " " + title;
			break;
		}
		//============================Email 본문 설정===================================
		String emailContent = "<div style='margin: 0px; padding: 0px; border: 0px; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; font-size: 15px; line-height: inherit; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web (West European)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, sans-serif; vertical-align: baseline; color: rgb(32, 31, 30); background-color: rgb(67, 108, 153);'>"
				+ "<h1 style='padding: 15px 0px 0px 15px; font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 16px; line-height: 1em; font-family: dotum; color: rgb(255, 255, 255);'>"
				+ title + "</h2>"
				+ "<div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 14px; line-height: 1.3em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255);'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'>"
				+ "회의실 : " + room + "<br>" + "회의시간 : " + formattedStartDate + "&nbsp~&nbsp" + formattedEndDate + "<br>" + "회의내용 : "
				+ content + "<br>"
				+ "<span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'></span></span><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'></span><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'>"
				+ "예약자 : (" + (String)reserveEmpData.get("empno") + ") " + (String)reserveEmpData.get("empFlnm"); // 사번 + 성명

		if (!state.equals("cancel")) { // 회의 예약 취소가 아닐시 바로가기 버튼 활성화
			emailContent = emailContent
					+ "<span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>&nbsp;</span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'><br></span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>[바로가기] 를 클릭하면 해당문서로 이동합니다.</span></span></div><div style='margin: 0px; padding: 0px 0px 0px 15px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.2em; font-family: verdana; vertical-align: baseline; color: rgb(208, 233, 255); height: 23px;'><span style='margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; color: inherit;'><span style='margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; color: inherit;'>(TR 시스템에 로그인되어 있어야 합니다.)</span></span></div></div><div style='margin: 6px 0px 0px 15px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 12px; line-height: 1em; font-family: dotum; vertical-align: baseline; color: rgb(85, 85, 85);'><br></div>\r\n"
					+ "<span style=\"color: rgb(85, 85, 85); font-family: dotum; font-size: 12px; font-weight: 700;\">&nbsp;"
					+ "</span><a href=\""+moveUrl+"\" target=\"_blank\" rel=\"noopener noreferrer\" data-auth=\"NotApplicable\" style=\"margin: 0px 0px 5px; padding: 4.14623px 10.3726px; border: 1px solid rgb(0, 137, 200); font-variant-numeric: normal; font-variant-east-asian: normal; font-weight: bold; font-stretch: normal; font-size: 13px; line-height: 1em; font-family: dotum; vertical-align: baseline; display: inline-block; color: rgb(255, 255, 255); text-align: center; background-color: rgb(67, 108, 153); border-radius: 3px; white-space: nowrap;\">바로가기</a>";	

		}
		//============================Email 전송부분====================================
		if(!attendEmpId.contains(reserveEmpId)){
			attendEmpId.add(reserveEmpId); // 예약자 전송대상에 추가
		}
		// 참석자 이메일 전송
		if (attendEmpId != null) {
			for (String empId : attendEmpId) {
				List<Map<String, Object>> attendPerson = DataFind(empId,"EMP");
				if (!attendPerson.isEmpty()) {
					String email = extractEmail(attendPerson.get(0));
					if (email != null) {
						try {
							emailSend(email, subject, emailContent);
						} catch (MessagingException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
				}
			}
		}
		
		//예약자 이메일전송 (예약자 + 참조자 추가)
//		if((reservEmpEmail == "" ? null : reservEmpEmail) != null) {
//			emailSendCC(reservEmpEmail, subject, emailContent);
//		}
	}


	/**
	 * EMAIL 구해오기 및 데이터 
	 * 
	 * @param Data -- 조회해올 사람의 데이터
	 * @param Type -- 조회해올 종류의 데이터 (Emp- 회원email,Cd-코드명)
	 */
	private List<Map<String, Object>> DataFind(String Data, String Type) {
		
		List<Map<String, Object>> list = new ArrayList<>();
		Map<String, Object> data1 = new HashMap<>();
		Map<String, Object> data2 = new HashMap<>();
		switch (Type) {
		case  "EMP":
			data1.put("tbNm", "EMP");
			data2.put("empId", Data);
			break;
		case "CD" :
			data1.put("tbNm", "CD");
			data2.put("cdValue", Data);
			break;
		}
		list.add(data1);
		list.add(data2);
		return serviceImpl.commonSelect(list);
	}
	
	/**
	* EMAIL 값 꺼내기
	*/
	private String extractEmail(Map<String, Object> personData) { 
		Object emailObj = personData.get("eml");
		if (emailObj instanceof String) {
			String email = (String) emailObj;
			return email.isEmpty() ? null : email;
		}
		return null;
	}

	/**
	* URL값 설정
	*/
	private String getCompleteUrl(String moveUrl, String detailId) {
	        try {
	        	 // 기본 URI 설정
	            URI baseUri = new URI("http://trs.vtw.co.kr");

	            // 받은 moveUrl을 URI로 변환하고 기본 URI와 결합
	            URI moveUri = new URI(moveUrl);
	            URI resolvedUri = baseUri.resolve(moveUri);

	            // 기존 쿼리 가져오기
	            String query = resolvedUri.getQuery();

	            // detailId가 비어 있지 않다면 쿼리 파라미터 추가
	            if (detailId != null && !detailId.isEmpty()) {
	                String newQuery = (query == null ? "" : query + "&") + "detailId=" + detailId;
	                query = newQuery;
	            }

	            // 새로운 URI 생성 (쿼리가 변경되었을 경우만 새 쿼리 추가)
	            URI finalUri = new URI(resolvedUri.getScheme(), resolvedUri.getAuthority(), resolvedUri.getPath(), query, resolvedUri.getFragment());

	            return finalUri.toString();
	        } catch (URISyntaxException e) {
	            e.printStackTrace();
	            return "Invalid URL";
	        }
	    }
	
	/**
	 * 회의실 예약 이메일 전송 (인사팀 참조)
	 * 
	 * @param emailSend
	 */
	public void emailSendCC(String to, String emailSend, String content) {
		// 운영 서버에서 요청시 또는 개발자에게만 이메일전송
		InetAddress local;
		String ip = "XX";

		String cc =  "jinwon.lee@vtw.co.kr";
		String cc2 =  "joori.an@vtw.co.kr";

		try {
			local = InetAddress.getLocalHost();
			ip = local.getHostAddress();
		} catch (Exception e) {
			e.getMessage();
		}

//		Boolean developerYn = false;
//		for (String developerEmail : Constants.DEVELOPER_EMAIL) {
//			if (to.equals(developerEmail)) {
//				developerYn = true;
//				break;
//			}
//		}

			String charSet = "UTF-8";

			Properties props = new Properties();
			props.put("mail.smtp.host", "smtp.office365.com");
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.port", "587");
			props.put("mail.smtp.starttls.enable", "true");

			Session session = Session.getInstance(props, new Authenticator() {
				@Override
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication("admin@vtw.co.kr","qmdlxl4291!@"); //id
				}
			});

			try {
				MimeMessage msg = new MimeMessage(session);
				msg.setFrom("admin@vtw.co.kr"); // 보내는이(관리자)
				msg.setRecipients(Message.RecipientType.TO, to); // 받는이
				InternetAddress[] addresscc = { new InternetAddress(cc), new InternetAddress(cc2) };// 인사팀 참조
				msg.setRecipients(Message.RecipientType.CC, addresscc); // 참조자
				msg.setSubject(emailSend, charSet); // 제목
				msg.setSentDate(new Date()); // 전송시간
				msg.setText(content, charSet); // 내용
				msg.setHeader("content-Type", "text/html"); // html type
				Transport.send(msg);

			} catch (MessagingException e) {
				e.getMessage();
			}

	
	}

	/**
	 * 이메일 전송
	 * 
	 * @param emailSend
	 */
	public void emailSend(String to, String emailSend, String content) throws MessagingException {
		// 운영 서버에서 요청시 또는 개발자에게만 이메일전송
		InetAddress local;
		String ip = "XX";

		try {
			local = InetAddress.getLocalHost();
			ip = local.getHostAddress();
		} catch (Exception e) {
			e.getMessage();
		}

//		Boolean developerYn = false;
//		for (String developerEmail : Constants.DEVELOPER_EMAIL) {
//			if (to.equals(developerEmail)) {
//				developerYn = true;
//				break;
//			}
//		}

		String charSet = "UTF-8";

		Properties props = new Properties();
		props.put("mail.smtp.host", "smtp.office365.com");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.port", "587");
		props.put("mail.smtp.starttls.enable", "true");

		Session session = Session.getInstance(props, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("admin@vtw.co.kr","qmdlxl4291!@"); // id , pwd
			}
		});
		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
		helper.setFrom("admin@vtw.co.kr");
		try {

			MimeMessage msg = new MimeMessage(session);
			msg.setFrom("admin@vtw.co.kr"); // 보내는이 *관리자*
			msg.setRecipients(Message.RecipientType.TO, to); // 받는이
			msg.setSubject(emailSend, charSet); // 제목
			msg.setSentDate(new Date()); // 전송시간
			msg.setText(content, charSet); // 내용
			msg.setHeader("content-Type", "text/html"); // html type
			Transport.send(msg);

		} catch (MessagingException e) {
			e.getMessage();
		}

	}

}
