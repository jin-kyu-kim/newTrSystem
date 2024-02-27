import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react";
import { useCookies } from "react-cookie";
import ApiRequest from '../../../utils/ApiRequest';
import EmpInfoJson from "./EmpInfoJson.json";
import CustomTable from "../../../components/unit/CustomTable";
import CustomDatePicker from "../../../components/unit/CustomDatePicker";
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import TextBox from "devextreme-react/text-box";
import Box, { Item } from "devextreme-react/box";
import CustomCdComboBox from "../../../components/unit/CustomCdComboBox";

const EmpProjectHist = (callBack) => {
    const [initParam, setInitParam] = useState({
        empno: "",
        empFlnm: "",
        jbpsNm: "",
        deptNm: "",
        telNo: "",
        hodfSttsNm: "",
      });


    const [projectHist, setProjectHist] = useState([]);
    const [selectProjectHist, setSelectProjectHist] = useState([]);

    const {keyColumn, tableColumns} = EmpInfoJson.prjctHist;

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
    const empId = cookies.userInfo.empId;
    const deptId = cookies.userInfo.deptId;

    /* 프로젝트 이력정보 */
    useEffect(() => {
        const projectHistData = async()=>{
        const param = [
            {tbNm: "EMP_PRJCT_HIST"},
            {
                empId : empId
            }
        ];
        try{
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setProjectHist(response);
        } catch(error){
            console.error('Error fetching data', error);
        }
        };
        projectHistData();
    }, []);

    /* 프로젝트 이력 로우 클릭 시*/
    const onRowHistClick = (e) => {
        const selectPrjctHist = async() => {
            const param = [
                {tbNm: "EMP_PRJCT_HIST"},
                {
                    empId : empId
                }
            ];
            try{
                const response = await ApiRequest("/boot/common/commonSelect", param);
                setSelectProjectHist(response);
            } catch(error){
                console.error('Error fetching data', error);
            }
        };
        selectPrjctHist();
    };
    const handleSubmit = () => {
        callBack(initParam);
      };


      const handleChgState = ({ name, value }) => {
        setInitParam({
          ...initParam,
          [name]: value,
        });
      };
    return (
        <div className = "container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "40px" }}>프로젝트 이력</h1>
            </div>
            <div style = {{ marginBottom: "20px" }}>
            <CustomTable
                keyColumn={keyColumn}
                columns={tableColumns}
                values={projectHist}
                paging={true}
                onRowDbClick={onRowHistClick}
            />
            </div>
            <div style = {{ marginBottom: "20px" }}>
            </div>
            <div style={{ marginBottom: "20px", backgroundColor: "#eeeeee", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "95%", height: "250px", backgroundColor: "#fff" }}>
          <h5>프로젝트 이력을 입력/수정 합니다.</h5>
          <Box direction="row" width="50%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="프로젝트명" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="시작일" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctMngrEmpIdItem" ratio={1}>
              <TextBox placeholder="종료일" stylingMode="filled" size="medium" name="empno" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
            
          </Box>
          <br />
          <Box direction="row" width="100%" height={40}>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="담당업무" name="jbpsNm" onSelect={handleChgState} value={initParam.jbpsNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="발주처" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="업무분류" name="jbpsNm" onSelect={handleChgState} value={initParam.jbpsNm} />
            </Item>
            <Item className="prjctNameItem" ratio={1}>
              <CustomCdComboBox param="VTW001" placeholderText="기술분류" name="deptNm" onSelect={handleChgState} value={initParam.deptNm} />
            </Item>
            <Item className="prjctMngrEmpIdItem" ratio={1}>
              <TextBox placeholder="비고" stylingMode="filled" size="medium" name="empno" onValueChanged={(e) => handleChgState({ name: e.component.option("name"), value: e.value })} />
            </Item>
          </Box>
          <Box style={{ marginTop: "30px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={handleSubmit} text="저장" />
            </Item>
            <Item className="searchBtnItem" ratio={1} style={{ width: "50px" }}>
              <Button onClick={handleSubmit} text="초기화" />
            </Item>
          </Box>
        </div>
      </div>

        </div>
    );
};

export default EmpProjectHist;


