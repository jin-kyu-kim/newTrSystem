import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';
import './ProjectHtCtAprvPop.css';

const ProjectHrCtAprvMmPop = ({props, prjctNm, data, currentDate, setCurrentDate, holiday}) => {

    const isWeekEnd = (date) => {
        const month = date.getMonth() + 1;
        let monthVal = month < 10 ? "0" + month : month;
        const day = date.getDate();
        let dayVal = day < 10 ? "0" + day : day;
        let ymd = date.getFullYear() + monthVal + dayVal;
        let index = holiday.findIndex(e => e.crtrYmd === ymd);

        if(index !== -1){
            return "holiday";
        }else
            if(date.getDay() === 0){
            return "sunday";
        }else if(date.getDay() === 6){
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

    const dataSource = [
        {
            id: 1,
            color: "#00af2c"
        },
        {
            id: 3,
            color: "#B93232"
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
                    dataSource={dataSource}
                    fieldExpr="id"
                />  
            </Scheduler>
            <br/>
            {showDetails()}
        </div>
    );

}
export default ProjectHrCtAprvMmPop;