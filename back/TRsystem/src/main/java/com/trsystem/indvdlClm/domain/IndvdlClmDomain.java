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

    public static int insertPrjctMM(List<Map<String, Object>> params){

        List<Map<String, Object>> newList = params.stream().distinct().collect(Collectors.toList());
        List<Map<String, Object>> insertList = new ArrayList<>();
        HashMap<String, Object> tbNm = new HashMap<String, Object>();
        tbNm.put("tbNm", "PRJCT_INDVDL_CT_MM");
        insertList.add(tbNm);

        for(int i = 0; i < newList.size(); i++){
            List <Map<String, Object>> searchList = new ArrayList<>();
            searchList.add(tbNm);
            searchList.add(newList.get(i));

            List<Map<String, Object>> list = commonService.commonSelect(searchList);
            if(list.isEmpty()){
                insertList.add(newList.get(i));
            }
        }
        int result = commonService.insertData(insertList);
        return result;
    }

    public static int insertPrjctHis(List<Map<String, Object>> params){
        List<Map<String, Object>> histList = new ArrayList<>();
        HashMap<String, Object> tbNmHist = new HashMap<String, Object>();
        tbNmHist.put("tbNm", "PRJCT_ATRZ_HIST");
        histList.add(tbNmHist);
        for(int i = 0; i < params.size(); i++){
            Map<String, Object> newParam = params.get(i);
            newParam.put("atrzDmndSttsCd","VTW03701");
            newParam.put("prjctAtrzHistSn", 1);
            histList.add(newParam);
        }
        int result = commonService.insertData(histList);
        return result;
    }
}
