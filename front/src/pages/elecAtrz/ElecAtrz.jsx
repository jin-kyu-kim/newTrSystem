import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet";
import elecAtrzJson from "./ElecAtrzJson.json";
import "./ElecAtrz.css";
import ApiRequest from 'utils/ApiRequest';

const ElecAtrz = () => {
  const navigate = useNavigate();
  const [ cookies ] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const { keyColumn, queryId, barList, searchInfo, baseColumns } = elecAtrzJson.elecMain;
  const [ param, setParam ] = useState({});
  const [ clickBox, setClickBox ] = useState(null);
  const [ titleRow, setTitleRow ] = useState([]); // 제목행을 동적으로 보여주기 위한 state
  const [ totalCount, setTotalCount ] = useState(0);
  const [ selectedList, setSelectedList ] = useState([]);
  
  const onNewReq = async () => {
    navigate("../elecAtrz/ElecAtrzForm");
  };

  useEffect(()=>{
    const getAtrz = async () => {
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', param)
            setSelectedList(response)
        } catch(error) {
            console.log('error', error)
        }
    };
    if(Object.keys(param).length !== 0 && param.sttsCd !== null) getAtrz();
  }, [param])

  const searchHandle = async (initParam) => {
    setParam({
        ...initParam,
        queryId: queryId
    });
  };  

  const getList = async (keyNm, refer, sttsCd) => {
    setClickBox(keyNm) // 선택된 박스의 색상 변경
    setTitleRow(baseColumns.concat(elecAtrzJson.elecMain[keyNm]))
    setParam({
        ...param,
        queryId: queryId,
        empId: empId,
        refer: refer,
        sttsCd: sttsCd
    })
  };

  const ElecBar = ({ text, barColor, children }) => {
    return (
      <div>
        <div className='elec-bar' style={{backgroundColor: barColor}}>{text}</div>
        <div className="elec-square-container">{children}</div>
      </div>
    );
  };

  const ElecSquare = ({ text, keyNm, refer, sttsCd, squareColor }) => {
    return (
      <div className='elec-square' onClick={() => getList(keyNm, refer, sttsCd)} style={(clickBox === keyNm) ? {backgroundColor:'#4473a5', color: 'white'} : {backgroundColor: squareColor}}>
        <div className="elec-square-text" style={{color: (clickBox === text) && 'white'}}>{text}</div>
        <div className="elec-square-count" style={{color: (clickBox === text) && 'white'}}>{totalCount} 건</div>
      </div>
    );
  };

  const clickHist = () => {
  }

  return (
    <div className="container">
        <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
        <div className="col-md-10 mx-auto" style={{ marginBottom: "20px" }}>
                <h3>전자결재</h3>
        </div>
      <div>
        <Button text="신규 기안 작성" onClick={onNewReq}></Button>
      </div>

      <div className="elec-container">
        {barList.map((bar) => (
          <ElecBar key={bar.text} text={bar.text} barColor={bar.barColor}>
            {bar.childList.map((child) => (
              <ElecSquare
                key={child.key}
                text={child.text}
                keyNm={child.key}
                refer={child.refer}
                sttsCd={child.sttsCd}
                squareColor={child.squareColor}
              />
            ))}
          </ElecBar>
        ))}
      </div>
           
      {selectedList.length !== 0 && 
        <div style={{marginTop: '20px'}}>
            <SearchInfoSet callBack={() => searchHandle} props={searchInfo} />
            <CustomTable 
                keyColumn={keyColumn} 
                values={selectedList} 
                columns={titleRow} 
                onClick={clickHist}
            />
        </div> }
    </div>
  );
};
export default ElecAtrz;