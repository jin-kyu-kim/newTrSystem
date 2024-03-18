import React from 'react';
import Scheduler from 'devextreme-react/scheduler';

const ProjectClaimCostIndividualCtPop = ({props, prjctNm, data}) => {

    const currentDate = new Date();
    const showDetails = () => {

        const results = [];

        props.map((data) => {
            results.push(
                <div>
                    <hr/>
                    <table>
                        <thead>
                            <tr>
                                <th>{data.startDate} {prjctNm} {data.utztnAmt} 원({data.atrzDmndSttsNm})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>사용처: {data.useOffic}</td>
                            </tr>
                            <tr>
                                <td>상세내역(목적): {data.ctPrpos}</td>
                            </tr>
                            <tr>
                                <td>용도(참석자명단): {data.atdrn}</td>
                            </tr>
                            <tr>
                                <td>{data.deptNm} {data.aprvrEmpFlnm} ({data.atrzDmndSttsNm})</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        });

        return results;
    }

    return (
        <div className="container">
            <div className="" style={{ marginBottom: "10px" }}>
                <>
                    <span>* {prjctNm} ({data.aplyOdr} 차수) 프로젝트 경비 </span>
                    <br/>
                    <span>* {data.empFlnm}</span>
                </> 
            </div>
            <Scheduler
                timeZone="Asia/Seoul"
                dataSource={props}
                defaultCurrentView="month"
                defaultCurrentDate={currentDate}
                editing={false}
                views={["month"]}
                descriptionExpr='ctPrpos'
            >
            </Scheduler>
            <br/>
            {showDetails()}
        </div>
    );

}
export default ProjectClaimCostIndividualCtPop;