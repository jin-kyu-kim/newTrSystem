import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';
import './ProjectHtCtAprvPop.css';

const ProjectHrCtAprvMmPop = ({props, prjctNm, data, currentDate, setCurrentDate}) => {

    const isWeekEnd = (date) => {
        const day = date.getDay();
        if(day === 0){
            return "sunday";
        }else if(day === 6){
            return "saturday";
        }
    };

    const showDetails = () => {

        const results = [];

        props.map((data) => {
            
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

    const DataCell = (props) => {
        const {
            data: {startDate, text}
        } = props;
        const dayClass = ['dx-template-wrapper'];
        dayClass.push(isWeekEnd(startDate));
        return (
            <div className={dayClass.join(' ')}>
                <div className={'day-cell'}>{text}</div>
            </div>
        );
    };

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
                dataCellComponent={DataCell}
                defaultCurrentView="month"
                currentDate={currentDate}
                editing={false}
                views={["month"]}
                onOptionChanged={e => {
                    if (e.name === "currentDate") {
                        setCurrentDate(e.value);
                    }
                }}
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