import React, { useState, useEffect } from "react";

import ProjectPrmpcBgtCmprJson from "./ProjectPrmpcBgtCmprJson.json";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";

const ProjectPrmpcBgtCmpr = ({prjctId, bgtMngOdr, bgtMngOdrTobe, visible, atrzDmndSttsCd}) => {

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
                prjctCmpr={true}
            />
        </>
    );
}

export default ProjectPrmpcBgtCmpr