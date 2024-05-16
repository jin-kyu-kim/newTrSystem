import React, { useState, useEffect } from "react";

import ProjectPrmpcBgtCmprJson from "./ProjectPrmpcBgtCmprJson.json";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";

const ProjectPrmpcBgtCmpr = ({prjctId, bgtMngOdr, bgtMngOdrTobe, visible, atrzDmndSttsCd, targetOdr}) => {

    const [values, setValues] = useState([]);
    const [totValues, setTotValues] = useState([]);
    const { keyColumn, queryId, tableColumns, wordWrap, groupingColumn ,groupingData, totKeyColumn, totTableColumns, totQueryId} = ProjectPrmpcBgtCmprJson;

    useEffect(() => {
        retrievePrjctPrmpcBgtCmpr();
        retrievePrjctPrmpcTotBgtCmpr();
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

    const retrievePrjctPrmpcTotBgtCmpr = async () => {
        const param = {
            queryId: totQueryId,
            prjctId: prjctId,
            bgtMngOdrTobe: bgtMngOdrTobe,
            atrzDmndSttsCd: atrzDmndSttsCd
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", param);

        setTotValues(response);
    }

    const groupingCustomizeText = (e) => {
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

    const calculateCustomSummary = (options) => {

        // const storeInfo = options.component.getDataSource().store()._array
        // let inComeAmt = 0, outComeAmt = 0, inComeRate = 0, outComeRate = 0;
      
        // storeInfo.forEach((item) => {
        //   if (item.bind === 1) {
        //     inComeAmt += item.costAmt;
        //     inComeRate += item.rate;
        //   }else {
        //     outComeAmt += item.costAmt;
        //     outComeRate += item.rate;
        //   }
        // });
    console.log(options.component.getDataSource().store()._array);
    console.log(options);

    const storeInfo = options.component.getDataSource().store()._array

    let bfe = 0;
    let aftr = 0;

    let totBgt = 0;
    let useBgt = 0;

    storeInfo.forEach((item) => {
        if(item.kind === 0) {
            totBgt = item.aftrBgt;
        } else {
            useBgt += item.aftrBgt;   
        }
    });

    if (options.summaryProcess === "start") {
        if(options.name === "test"){
            options.totalValue = useBgt;
        }
        if(options.name === "rateTotal"){
        } 
    }


    /**
     * 
    const totalAmt = inComeAmt-outComeAmt;
    const totalRate = inComeRate-outComeRate;
    
    if (options.summaryProcess === "start") {
        if(options.name === "costAmtTotal"){
            options.totalValue = totalAmt;
        }
        if(options.name === "rateTotal"){
            options.totalValue = totalRate;
        } 
    }
    */
};

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
                width="100%"
                calculateCustomSummary={calculateCustomSummary}
            />

            <div style={{marginTop: "20px"}}></div>
            <CustomTable
                keyColumn={totKeyColumn}
                columns={totTableColumns}
                values={totValues}
                paging={false}
                wordWrap={wordWrap}
                width="100%"
            />
        </>
    );
}

export default ProjectPrmpcBgtCmpr