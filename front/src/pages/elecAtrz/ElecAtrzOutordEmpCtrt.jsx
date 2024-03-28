import React, {useEffect, useState} from "react";
import CustomLabelValue from "../../components/unit/CustomLabelValue";
import ElecAtrzOutordEmpCtrtJson from "../elecAtrz/ElecAtrzOutordEmpCtrtJson.json";
import CompanyCtrtInfo from "./ctrtInfo/CompanyCtrtInfo"
import ElecAtrzCtrtInfo from "./ctrtInfo/ElecAtrzCtrtInfo";

const ElecAtrzOutordEmpCtrt = ({data, prjctId}) => {

    console.log(data);
    console.log(prjctId)
    
    useEffect(() => {

    }, []);


    return (
        <>
            <ElecAtrzCtrtInfo data={data}/>
            <CompanyCtrtInfo prjctId={prjctId} data={data}/>
        </>
    );
};
export default ElecAtrzOutordEmpCtrt;