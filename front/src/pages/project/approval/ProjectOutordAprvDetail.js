import React, { useEffect, useState, } from 'react'
import CustomTable from '../../../components/unit/CustomTable'
import ProjectOutordAprvDetailJson from './ProjectOutordAprvDetailJson.json'

const ProjectOutordAprvDetail = () => {

    const {outordLbrco, outordEntrps, matrl} = ProjectOutordAprvDetailJson;
    const [outordLbrcoValues, setOutordLbrcoValues] = useState([]);
    useEffect(() => {

        console.log("useEffect");
    }, []);



    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <h1 style={{ fontSize: "40px" }}>외주비용승인</h1>
            </div>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 외주인력(월급여)</span>
            </div>
            <CustomTable keyColumn={outordLbrco.keyColumn} columns={outordLbrco.tableColumns} values={outordLbrcoValues} paging={true}/>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 외주업체(기성금)</span>
            </div>
            <CustomTable keyColumn={outordEntrps.keyColumn} columns={outordEntrps.tableColumns} values={outordLbrcoValues} paging={true}/>
            <div className="" style={{ marginBottom: "10px" }}>
                <span>* 재료비</span>
            </div>
            <CustomTable keyColumn={matrl.keyColumn} columns={matrl.tableColumns} values={outordLbrcoValues} paging={true}/>
        </div>
    );

};

export default ProjectOutordAprvDetail;