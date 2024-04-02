import React, { useEffect, useState } from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';

const ProjectHrCtAprvCtPop = ({props, prjctNm, data}) => {

    const [currentDate, setCurrentDate] = useState(null);

    useEffect(() => {
        setCurrentDate(data.aplyYm?.slice(0,4)+"/"+data.aplyYm?.slice(4,6)+"/01");
    }, [data]);

    const showDetails = () => {

        const results = [];

        props.map((data) => {
            results.push(
                <>
                <hr/>
                <table>
                    <thead>
                        <tr>
                            <th>{data.startDate}({data.ctPrpos})</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>사용금액: {data.utztnAmt} 원</td>
                        </tr>
                        <tr>
                            <td>상세내역(목적): {data.ctPrpos}</td>
                        </tr>
                        <tr>
                            <td>용도(참석자명단): {data.atdrn}</td>
                        </tr>
                        <tr>
                            <td>사용처: {data.useOffic} | 결재정보_수정예정</td>
                        </tr>
                    </tbody>
                </table>
                </>
            )
        });

        return results;

    }


    return (
        <div className="container">
            <div className="" style={{ marginBottom: "10px" }}>
                <>
                    <span>* {prjctNm} ({data.aplySn} 차수) 프로젝트 비용 </span>
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
                descriptionExpr='ctPrpos'
                onOptionChanged={e => console.log(e)}
            >
            </Scheduler>
            <br/>
            {showDetails()}
        </div>
    );

}
export default ProjectHrCtAprvCtPop;