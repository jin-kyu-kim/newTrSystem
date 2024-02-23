import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";

import EmpProjectHistJson from "./EmpProjectHistJson.json";
import CustomTable from "../../../components/unit/CustomTable";

const EmpProjectHist = () => {

    const {keyColumn, tableColumns} = EmpProjectHistJson;

    return (
        <div className = "container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>프로젝트 이력</h1>
            </div>
            <div style = {{ marginBottom: "20px" }}>
            <CustomTable
                keyColumn={keyColumn}
                columns={tableColumns}
                paging={true}
            />
            </div>
            <div style = {{ marginBottom: "20px" }}>

            </div>
        </div>
    );
};

export default EmpProjectHist;


