import React, {useEffect, useState} from "react";
import CustomLabelValue from "../../components/unit/CustomLabelValue";
import ElecAtrzOutordEmpCtrtJson from "../elecAtrz/ElecAtrzOutordEmpCtrtJson.json";

import ElecAtrzCtrtInfo from "./ctrtInfo/ElecAtrzCtrtInfo";

const ElecAtrzOutordEmpCtrt = ({data, prjctData}) => {

    console.log(data);
    console.log(prjctData)
    
    useEffect(() => {

    }, []);


    return (
        <>
            <ElecAtrzCtrtInfo data={data}/>z
            <div>
                계약 세부 내용
            </div>
            <div>세부내용이 주를를르르ㅡ르르르르르ㅡㄱ</div>
        </>
    );
};
export default ElecAtrzOutordEmpCtrt;