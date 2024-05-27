import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

const ProjectClaimCostIndividualMmPop = ({props, prjctNm, startYmOdr, endYmOdr, data}) => {

    const currentDate = new Date(`${startYmOdr.substr(0, 4)}-${startYmOdr.substr(4, 2)}-01`);

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
                    <span>* {prjctNm} ({startYmOdr.substr(0,6)}-{startYmOdr.substr(6,1)}~{endYmOdr.substr(0,6)}-{endYmOdr.substr(6,1)}) 수행인력 </span>
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