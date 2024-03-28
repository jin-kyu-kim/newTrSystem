import React, {useEffect} from "react";
import ElecAtrzCtrtInfo from "./ctrtInfo/ElecAtrzCtrtInfo";
import ElecAtrzCtrtInfoDetail from "./ctrtInfo/ElecAtrzCtrtInfoDetail";

const ElecAtrzOutordEmpCtrt = ({data, prjctId}) => {

    console.log(data);
    console.log(prjctId)
    
    useEffect(() => {

    }, []);

    /**
     *  VTW04909 외주업체 계약, 
     *  VTW04910 재료비 계약,
     */
    return ( 
        <>
        {["VTW04909","VTW04910"].includes(data.elctrnAtrzTySeCd) &&  (
            <>
            <ElecAtrzCtrtInfo data={data}/>
            <ElecAtrzCtrtInfoDetail prjctId={prjctId} data={data}/>
            </>
        )}
        </>
    );
};
export default ElecAtrzOutordEmpCtrt;

