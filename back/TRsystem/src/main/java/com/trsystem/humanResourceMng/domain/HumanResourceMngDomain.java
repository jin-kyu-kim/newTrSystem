package com.trsystem.humanResourceMng.domain;

import com.trsystem.common.service.CommonService;
import com.trsystem.email.service.EmailSendService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Data
@NoArgsConstructor
@Component
public class HumanResourceMngDomain {

    private static CommonService commonService;
    private static EmailSendService emailSendService;

    @Autowired
    public HumanResourceMngDomain(CommonService commonService, EmailSendService emailSendService){
        HumanResourceMngDomain.commonService = commonService;
        HumanResourceMngDomain.emailSendService = emailSendService;
    }

    // 회의실예약정보저장
    public static int insertMtgRoomRsvt (List<Map<String, Object>> params){
        List<Map<String, Object>> selectMtgRoomMaxSnResult = commonService.queryIdSearch(new HashMap<>(){{ put("queryId", "humanResourceMngMapper.retrieveMtgRoomSnInq"); }});
        int maxSn = Integer.parseInt(String.valueOf(selectMtgRoomMaxSnResult.get(0).get("maxSn")));

        Map<String, Object> snMap = new HashMap<>();

        for(int i = 0; i < params.size(); i++){
            if(params.get(i).keySet().contains("insertMtgRoomRsvtValue")){
                snMap = (Map<String, Object>) params.get(i).get("insertMtgRoomRsvtValue");
                if(!snMap.get("mtgRoomRsvtSn").equals("")){
                    maxSn = Integer.parseInt(String.valueOf(snMap.get("mtgRoomRsvtSn")));
                }
            }
        }

        List<Map<String, Object>> insertMtgRoomRsvtAtdrn = new ArrayList<>();
        Map<String, Object> insertRefMtgRoomRsvt = new HashMap<>();
        ArrayList<Object> insertRefMtgRoomRsvtAtdrn = new ArrayList<>();

        for(int i = 0; i < params.size(); i++){
            if(params.get(i).keySet().contains("insertMtgRoomRsvtValue")){
                insertRefMtgRoomRsvt = (Map<String, Object>) params.get(i).get("insertMtgRoomRsvtValue");
                insertRefMtgRoomRsvt.put("mtgRoomRsvtSn", maxSn);
                insertRefMtgRoomRsvt.put("queryId", "humanResourceMngMapper.retrieveMtgRoomStrgMdfcn");
            } else if(params.get(i).keySet().contains("atndEmpIdList")){
                insertRefMtgRoomRsvtAtdrn = (ArrayList<Object>) params.get(i).get("atndEmpIdList");
            }
        }

        String[] splitstr = insertRefMtgRoomRsvtAtdrn.toString().substring(1, insertRefMtgRoomRsvtAtdrn.toString().length() - 1).split(", ");
        for(int i = 0; i < splitstr.length; i++){
            int cnt = i;
            int inMaxSn = maxSn;
            insertMtgRoomRsvtAtdrn.add(i, new HashMap<>() {{
                put("queryId", "humanResourceMngMapper.retrieveMtgRoomAtdrnStrgMdfcn");
                put("atndEmpId", splitstr[cnt]);
                put("mtgRoomRsvtSn", inMaxSn);
                put("mtgAtdrnSn", cnt + 1);
            }});
        }
        commonService.queryIdSearch(insertRefMtgRoomRsvt);

        for(int i = 0; i < insertMtgRoomRsvtAtdrn.size(); i++){
            commonService.queryIdSearch(insertMtgRoomRsvtAtdrn.get(i));
        }
        emailSendService.roomReserveEmailSend(
                String.valueOf(insertRefMtgRoomRsvt.get("rsvtEmpId"))
                , (ArrayList<String>) params.get(1).get("atndEmpIdList")
                , String.valueOf(insertRefMtgRoomRsvt.get("state"))
                , insertRefMtgRoomRsvt.get("useYmd") + String.valueOf(insertRefMtgRoomRsvt.get("useBgngHm"))
                , insertRefMtgRoomRsvt.get("useEndYmd") + String.valueOf(insertRefMtgRoomRsvt.get("useEndHm"))
                , String.valueOf(insertRefMtgRoomRsvt.get("mtgTtl"))
                , String.valueOf(insertRefMtgRoomRsvt.get("mtgRoomCd"))
        );

        return 1;
    }

    public static int deleteMtgRoomRsvt (String params){
        List<Map<String, Object>> deleteMtgRoomRsvt = new ArrayList<>();
        deleteMtgRoomRsvt.add(0, new HashMap<>(){{ put("tbNm", "MTG_ROOM_RSVT"); }});
        deleteMtgRoomRsvt.add(1, new HashMap<>(){{ put("mtgRoomRsvtSn", params); }});

        List<Map<String, Object>> deleteMtgRoomRsvtAtdrn = new ArrayList<>();
        deleteMtgRoomRsvtAtdrn.add(0, new HashMap<>(){{ put("tbNm", "MTG_ROOM_RSVT_ATDRN"); }});
        deleteMtgRoomRsvtAtdrn.add(1, new HashMap<>(){{ put("mtgRoomRsvtSn", params); }});

        // 전체 참석자 예약취소 메일 발송
        Map<String, Object> mtgRoomParam = new HashMap<>();
        mtgRoomParam.put("queryId", "humanResourceMngMapper.retrieveMtgRoomInfo");
        mtgRoomParam.put("mtgRoomRsvtSn", params);
        List<Map<String, Object>> mtgRoomInfo = commonService.queryIdSearch(mtgRoomParam);

        List<String> atndEmpIdList = new ArrayList<>();
        for (Map<String, Object> map : mtgRoomInfo) {
            String atndEmpId = (String) map.get("atndEmpId");
            if (atndEmpId != null) {
                atndEmpIdList.add(atndEmpId);
            }
        }
        emailSendService.roomReserveEmailSend(
                String.valueOf(mtgRoomInfo.get(0).get("rsvtEmpId"))
                , atndEmpIdList
                , "cancel"
                , String.valueOf(mtgRoomInfo.get(0).get("startTime"))
                , String.valueOf(mtgRoomInfo.get(0).get("endTime"))
                , String.valueOf(mtgRoomInfo.get(0).get("mtgTtl"))
                , String.valueOf(mtgRoomInfo.get(0).get("mtgRoomCd"))
        );

        commonService.deleteData(deleteMtgRoomRsvtAtdrn);
        commonService.deleteData(deleteMtgRoomRsvt);

        return 0;
    }

    public static int insertVcatnMngExcel (List<Map<String, Object>> params){
        for (Map<String, Object> insertVcatnMngMap : params){
            insertVcatnMngMap.put("queryId", "humanResourceMngMapper.insertVcatnMngExcel");
            insertVcatnMngMap.put("state", "INSERT");

            commonService.queryIdDataControl(insertVcatnMngMap);
        }

        return 0;
    }
    /* =================================박지환_작업================================= */
}
