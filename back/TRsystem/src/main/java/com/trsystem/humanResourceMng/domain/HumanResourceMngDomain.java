package com.trsystem.humanResourceMng.domain;

import com.trsystem.common.service.ApplicationYamlRead;
import com.trsystem.common.service.CommonService;
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

    @Autowired
    public HumanResourceMngDomain(CommonService commonService, ApplicationYamlRead applicationYamlRead){
        HumanResourceMngDomain.commonService = commonService;
    }


    /* =================================박지환_작업================================= */
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

        Map<String, Object> insertMtgRoomRsvt = new HashMap<>();
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

//        insertMtgRoomRsvt.add(0, new HashMap<>(){{ put("tbNm", "MTG_ROOM_RSVT"); }});
//        insertMtgRoomRsvtAtdrn.add(0, new HashMap<>(){{
//            put("snColumn", "MTG_ATDRN_SN");
//            put("tbNm", "MTG_ROOM_RSVT_ATDRN");
//        }});

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

//        commonService.insertData(insertMtgRoomRsvt);
//        commonService.insertData(insertMtgRoomRsvtAtdrn);

        return 0;
    }

    public static int deleteMtgRoomRsvt (String params){
        List<Map<String, Object>> deleteMtgRoomRsvt = new ArrayList<>();
        deleteMtgRoomRsvt.add(0, new HashMap<>(){{ put("tbNm", "MTG_ROOM_RSVT"); }});
        deleteMtgRoomRsvt.add(1, new HashMap<>(){{ put("mtgRoomRsvtSn", params); }});

        List<Map<String, Object>> deleteMtgRoomRsvtAtdrn = new ArrayList<>();
        deleteMtgRoomRsvtAtdrn.add(0, new HashMap<>(){{ put("tbNm", "MTG_ROOM_RSVT_ATDRN"); }});
        deleteMtgRoomRsvtAtdrn.add(1, new HashMap<>(){{ put("mtgRoomRsvtSn", params); }});

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
