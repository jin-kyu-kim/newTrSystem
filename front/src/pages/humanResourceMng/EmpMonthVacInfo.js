import {useEffect, useState} from 'react';
import 'devextreme/dist/css/dx.light.css';
import Calendar from "../../components/unit/Calendar"
import AutoCompleteName from "../../components/unit/AutoCompleteName"
import ApiRequest from "../../utils/ApiRequest";
import EmpMonthVacInfoJson from "./EmpMonthVacInfo.json"
import Box, {Item} from "devextreme-react/box"
import {Button} from "devextreme-react/button";

const {queryId} = EmpMonthVacInfoJson;

const EmpMonthVacInfo = () => {
    const [param, setParam] = useState([]);
    const [values, setValues] = useState([]);
    const [searchParam, setSearchParam] = useState({empno: ""});
    
    // 화면 최초로드 시 조회 param 설정
    useEffect(() => {
        setParam({
            queryId: queryId,
        });
    },[]);

    // 조회
    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
    }, [param]);

    // 조회
    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);

            // 휴가테이블 구조상 2일이상의 휴가인 경우 커스텀하여 휴가일수(vcatnDeCnt) 데이터 추가
            for(let i = 0; i < response.length; i++){
                if(response[i].vcatnDeCnt > 1){
                    for(let j = 1; j < response[i].vcatnDeCnt; j++){
                        response.push({
                            title:response[i].title,
                            date:String(parseInt(response[i].date) + 1)
                        });
                    }
                }
            }
            setValues(response);
        } catch (error) {
            console.log(error);
        }
    };

    // 검색실행
    const searchHandle = () => {
        setParam({
            queryId: queryId,
            empno: searchParam.empno
        });
    }

    // 성명선택
    const handleChgEmp = (selectedOption) => {
        setSearchParam({
            empno: selectedOption,
        });
    };

    return (
        <div className="container">
            <div className="mx-auto" style={{marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "30px" }}>월별휴가정보</h1>
            </div>
            <div className="mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 직원의 월별 휴가정보를 조회합니다.</span>
            </div>
            <div className="box_search">
                <Box direction="flex" style={{width:"80vh"}}>
                    <Item className="empnoItem" ratio={1} style={{width:"250px"}}>
                        <AutoCompleteName
                            placeholderText="성명"
                            onValueChange={handleChgEmp}    
                        />
                    </Item>
                    <Item className="searchBtnItem" ratio={1}>
                        <Button
                            onClick={searchHandle} text="검색" style={{height:"48px", width:"50px"}}
                        />
                    </Item>
                </Box>
            </div>
            <div className="mx-auto" style={{marginBottom: "20px", marginTop: "30px"}}>
                <Calendar 
                    values={values} 
                    headerToolbar={{
                        left: 'prevYear,nextYear',
                        center: 'title',
                        right: 'prev,next'
                    }} 
                    initialView="dayGridMonth"
                    initCssValue="monthStyle"
                    clickEventValue="false"
                    />
            </div>
        </div>
    );
}

export default EmpMonthVacInfo;