package com.trsystem.indvdlClm.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.trsystem.common.service.CommonService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@Component
public class IndvdlClmDomain {
    private static CommonService commonService;

    @Autowired
    public IndvdlClmDomain(CommonService commonService){
        IndvdlClmDomain.commonService = commonService;
    }

    public static List<Map<String, Object>> selectPrjctMM(List<Map<String, Object>> params){

        List<Map<String, Object>> newList = params.stream().distinct().collect(Collectors.toList());
        List<Map<String, Object>> result = new ArrayList<>();
        HashMap<String, Object> tbNm = new HashMap<String, Object>();
        tbNm.put("tbNm", "PRJCT_INDVDL_CT_MM");

        for(int i = 0; i < newList.size(); i++){
            List <Map<String, Object>> searchList = new ArrayList<>();
            searchList.add(tbNm);
            searchList.add(newList.get(i));

            List<Map<String, Object>> list = commonService.commonSelect(searchList);
            if(list.isEmpty()){
                result.add(newList.get(i));
            }
        }
        return result;
    }

    public static List<Map<String, Object>> insertPrjctMM(List<Map<String, Object>> params){
        List<Map<String, Object>> mmList = new ArrayList<>();
        HashMap<String, Object> tbNmMM = new HashMap<String, Object>();
        tbNmMM.put("tbNm", "PRJCT_INDVDL_CT_MM");
        mmList.add(tbNmMM);
        mmList.addAll(params);
        int resultMM = commonService.insertData(mmList);

        List<Map<String, Object>> histList = new ArrayList<>();
        if (resultMM > 0){
            HashMap<String, Object> tbNmHist = new HashMap<String, Object>();
            tbNmHist.put("tbNm", "PRJCT_ATRZ_HIST");
            histList.add(tbNmHist);
            for(int i = 0; i < params.size(); i++){
                Map<String, Object> newParam = params.get(i);
                newParam.put("atrzDmndSttsCd","VTW03701");
                newParam.put("prjctAtrzHistSn", 1);
                histList.add(newParam);
            }
            int resultHist = commonService.insertData(histList);
        }
        return histList;
    }
}
