import React, { useState, useEffect } from "react";

import ProjectPrmpcBgtCmprJson from "./ProjectPrmpcBgtCmprJson.json";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";

const ProjectPrmpcBgtCmpr = ({prjctId, bgtMngOdr, bgtMngOdrTobe, visible, atrzDmndSttsCd, targetOdr}) => {

    const [values, setValues] = useState([]);
    const { keyColumn, queryId, tableColumns, wordWrap, groupingColumn ,groupingData} = ProjectPrmpcBgtCmprJson;

    useEffect(() => {
        retrievePrjctPrmpcBgtCmpr();
    }, [visible, bgtMngOdr])

    const retrievePrjctPrmpcBgtCmpr = async () => {
        const param = {
            queryId: queryId,
            prjctId: prjctId,
            bgtMngOdr: bgtMngOdr,
            bgtMngOdrTobe: bgtMngOdrTobe,
            atrzDmndSttsCd: atrzDmndSttsCd
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", param);

        setValues(response);
    }

    const groupingCustomizeText = (e) => {
        console.log(e)
        if (e.value === '1') {
            return "인건비";
          }else if (e.value === '2') {
            return "외주비";
          } else if (e.value === '3') {
            return "경비";
          } else {
            return "재료비";
          } 
    }

    return (
        <>

            <CustomTable
                keyColumn={keyColumn}
                columns={tableColumns}
                values={values}
                paging={false}
                wordWrap={wordWrap}
                grouping={groupingColumn}
                groupingData={groupingData}
                groupingCustomizeText={groupingCustomizeText}
                prjctCmpr={true}
            />
        </>
    );
}

export default ProjectPrmpcBgtCmpr