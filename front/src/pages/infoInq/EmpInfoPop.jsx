import React, { useState, useEffect , useRef} from "react";
import EmpInfoJson from "./EmpInfoJson.json";
import ApiRequest from "utils/ApiRequest";
import { useCookies } from "react-cookie";
import { Button } from "devextreme-react";
import ReactToPrint from "react-to-print";
import {Item,Form,GroupItem,} from "devextreme-react/form";
import CustomEditTable from "components/unit/CustomEditTable";

const EmpInfoPop = ({ naviEmpId }) => {
  const [baseInfoData, setBaseInfoData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  /*유저세션*/
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
  const [degree, setDegree] = useState([]);
  const EmpDegree = EmpInfoJson.EmpDegree;

  const EmpDegreeData = { queryId: EmpDegree.queryId, keyColumn: EmpDegree.keyColumn, tableColumns: EmpDegree.tableColumns};




   let empId;

    if(naviEmpId.length !== 0){
        empId = naviEmpId;
    } else {
        empId = cookies.userInfo.empId;
    }

    /* 기본 정보 */
    useEffect(() => {
    
      baseData();
 }, []);

  const baseData = async () => {
    const param = {
      queryId: "infoInqMapper.retrieveEmpBassInfo",
      empId: empId,
    };
    
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", param);
      delete response[0].regDt;
      delete response[0].regEmpId;
      setBaseInfoData(response[0]);
    
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const pageDegree = async () => {
    try {
      const response = await ApiRequest("/boot/common/queryIdSearch", {
        queryId: EmpDegreeData.queryId, empId: empId
      });
      if(response.length !== 0) setDegree(response);
    } catch (error) {
      console.log(error);
    }
  };


  const componentRef = useRef();
  return (
    <React.Fragment>
    <div ref ={componentRef} style={{ padding: "20px" ,backgroundColor: "#b5c1c7", width : "100%" }}>
    <div style={{ padding: "20px" ,backgroundColor: "#b5c1c7" }}>
    <div className="container" style={{ padding: "20px" ,backgroundColor: "#fff" }}>
        <div>
          <p>
            <strong>* 직원 기본정보</strong>
          </p>
          <Form colCount={2}>
            <GroupItem>
              <GroupItem >
                <Item
                  dataField="성명"
                  editorOptions={{
                    value: baseInfoData.empFlnm,
                    readOnly: true,
                  }}
                />
                <Item
                  dataField="전화번호"
                  editorOptions={{ value: baseInfoData.telno, readOnly: true }}
                />
                <Item
              
                  dataField="생년월일"
                  editorOptions={{ value: baseInfoData.brdt, readOnly: true }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem>
              <GroupItem >
                <Item
              
                  dataField="소속"
                  editorOptions={{ value: baseInfoData.deptNm, readOnly: true }}
                />
                <Item
                  dataField="이메일"
                  editorOptions={{ value: baseInfoData.eml, readOnly: true }}
                />
              </GroupItem>
            </GroupItem>
          </Form>
          <p style={{marginTop : "20px" , marginBottom: "20px"}}>
            <strong >* 학력정보</strong>
          </p>
        
          <CustomEditTable
        
          values={degree}
          keyColumn={EmpDegreeData.keyColumn}
          columns={EmpDegreeData.tableColumns}
          callback={pageDegree}
          noEdit={true}
        />     

    
         
         
          </div>
          &nbsp;
        </div>
      </div>
      <ReactToPrint 
		  trigger={() => (
        <button
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginLeft: '18px',
            ...(isHovered && { backgroundColor: '#0056b3' })
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          인쇄
        </button>
      )}
		content={() => componentRef.current} 
        pageStyle="@page { size: A4; ratio:100%; }" 
	/>
  
    </div>
    </React.Fragment>
    
  );
};

export default EmpInfoPop;

