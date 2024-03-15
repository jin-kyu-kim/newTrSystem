import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

const ProjectClaimCostIndividualMmPop = ({props, prjctNm, data}) => {

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
                                <th>{data.startDate}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{prjctNm} {data.md} hrs. | {data.deptNm} {data.aprvrEmpFlnm} ({data.atrzDmndSttsNm}) </td>
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
                <div>
                    <span>* {prjctNm} ({data.aplySn} 차수) 수행인력 </span>
                    <br/>
                    <span>* {data.empFlnm}</span>
                </div>
            </div>
            <Scheduler
                timeZone="Asia/Seoul"
                dataSource={props}
                defaultCurrentView="month"
                defaultCurrentDate={currentDate}
                editing={false}
                views={["month"]}
            >
            </Scheduler>
            <br/>
            {showDetails()}
        </div>
    );

}
export default ProjectClaimCostIndividualMmPop;