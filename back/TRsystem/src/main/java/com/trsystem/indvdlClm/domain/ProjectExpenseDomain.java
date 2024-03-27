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
public class ProjectExpenseDomain {
    private static CommonService commonService;

    @Autowired
    public ProjectExpenseDomain(CommonService commonService){
        ProjectExpenseDomain.commonService = commonService;
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
}
