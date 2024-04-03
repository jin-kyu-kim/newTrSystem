import React, { useEffect, useState } from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';

const ProjectHrCtAprvMmPop = ({props, prjctNm, data}) => {

    const [currentDate, setCurrentDate] = useState(null);

    useEffect(() => {
        setCurrentDate(data.aplyYm?.slice(0,4)+"/"+data.aplyYm?.slice(4,6)+"/01");
    }, [data]);

    const showDetails = () => {

        const results = [];

        const temp = props.filter((data) => data.atrzDmndSttsCd !== "VTW03702");

        temp.map((data) => {
            
            results.push(
                <>
                <hr/>
                <table>
                    <thead>
                        <tr>
                            <th>{data.startDate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{prjctNm} {data.md} hrs. | {data.deptNm} {data.aprvrEmpFlnm} ({data.atrzDmndSttsNm}) </td>
                        </tr>
                    </tbody>
                </table>
                </>
            )
        });
            
        return results;

    }

    const atrzDmndStts = [
        {
            id: 1,
            text: "요청",
            color: "#00af2c"
        }
    ]


    return (
        <div className="container">
            <div className="" style={{ marginBottom: "10px" }}>
                <>
                    <span>* {prjctNm} ({data.aplySn} 차수) 수행인력 </span>
                    <br/>
                    <span>* {data.empFlnm}</span>
                </> 
            </div>
            <Scheduler
                timeZone="Asia/Seoul"
                dataSource={props}
                defaultCurrentView="month"
                currentDate={currentDate}
                editing={false}
                views={["month"]}
            >
                <Resource
                    dataSource={atrzDmndStts}
                    fieldExpr="id"
                />  
            </Scheduler>
            <br/>
            {showDetails()}
        </div>
    );

}
export default ProjectHrCtAprvMmPop;