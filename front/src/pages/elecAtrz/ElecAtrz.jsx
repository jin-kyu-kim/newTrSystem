import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import { Tooltip } from 'devextreme-react/tooltip';
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet";
import elecAtrzJson from "./ElecAtrzJson.json";
import ApiRequest from 'utils/ApiRequest';
import "./ElecAtrz.css";

const ElecAtrz = () => {
  const navigate = useNavigate();
  const [ cookies ] = useCookies(["userInfo", "userAuth"]);
  const empId = cookies.userInfo.empId;
  const { keyColumn, queryId, countQueryId, barList, searchInfo, baseColumns } = elecAtrzJson.elecMain;
  const [ param, setParam ] = useState({});
  const [ clickBox, setClickBox ] = useState(null);
  const [ titleRow, setTitleRow ] = useState([]);
  const [ totalCount, setTotalCount ] = useState([]);
  const [ selectedList, setSelectedList ] = useState([]);

  const onNewReq = async () => {
    navigate("../elecAtrz/ElecAtrzForm");
  };

  useEffect(() => {
    const getAtrz = async () => {
      try {
        const response = await ApiRequest('/boot/common/queryIdSearch', param)
        setSelectedList(response)
      } catch (error) {
        console.log('error', error)
      }
    };
    if (Object.keys(param).length !== 0) getAtrz();
  }, [param])

  const searchHandle = async (initParam) => {
    setParam({
      ...param,
      ...initParam
    });
  };

  useEffect(() => {
    const getAllCount = async () => {
      try{
        const response = await ApiRequest('/boot/common/queryIdSearch', { queryId: countQueryId, empId: empId });
        setTotalCount(response);
      } catch(error) {
        console.log('error', error);
      }
    }
    getAllCount();
  }, []);

  const getList = async (keyNm, refer, sttsCd) => {
    setClickBox(keyNm); // 선택된 박스의 색상 변경
    setSelectedList([]);
    setTitleRow(baseColumns.concat(elecAtrzJson.elecMain[keyNm]));
    setParam({
      queryId: queryId, 
      empId: empId,
      refer: refer,
      sttsCd: sttsCd
    });
  };

  const ElecBar = ({ text, barColor, color, width, children }) => {
    return (
      <div style={{width}}>
        <div className='elec-bar' style={{ backgroundColor: barColor, color: color }}>{text}</div>
        <div className="elec-square-container">{children}</div>
      </div>
    );
  };

  const ElecSquare = ({ keyNm, info }) => {
    return (
      <div id={keyNm} onClick={() => getList(keyNm, info.refer, info.sttsCd)} style={(clickBox === keyNm) ? 
        { backgroundColor: '#4473a5', color: 'white' } : { backgroundColor: info.squareColor }} className='elec-square' >

        <div className="elec-square-text" style={{ color: (clickBox === info.text) && 'white' }}>{info.text}</div>
        <div className="elec-square-count" style={{ color: (clickBox === info.text) && 'white' }}>
          {totalCount.length !== 0 && (totalCount[0][keyNm] === 0 ? 0 : <span>{totalCount[0][keyNm]}</span> )} 건
        </div>
        <Tooltip
          target={`#${keyNm}`}
          showEvent="mouseenter"
          hideEvent="mouseleave"
          position="top"
          hideOnOutsideClick={false} >
            <div className='elecTooltip'>{info.tooltip}</div>
        </Tooltip>
      </div>
    );
  };

  const sendDetail = (e, param) => {
    navigate('/elecAtrz/ElecAtrzDetail', {state: {data: e.data, sttsCd: param.sttsCd}});
  };

  return (
    <div className="container">
      <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "20px", display: 'flex' }}>
        <h3 style={{marginRight: '50px'}}>전자결재</h3>
        <div>
          <Button text="신규 기안 작성" onClick={onNewReq} type='danger'></Button>
        </div>
      </div>

      <div className="elec-container">
        {barList.map((bar) => (
          <ElecBar key={bar.text} text={bar.text} barColor={bar.barColor} width={bar.width} color={bar.color}>
            {bar.childList.map((child) => (
              <ElecSquare
                key={child.key}
                keyNm={child.key}
                info={child.info}
              /> ))}
          </ElecBar>
        ))}
      </div>

      {(selectedList.length !== 0 || param.sttsCd !== undefined) && (
        <div style={{ marginTop: '20px' }}>
          <div style={{marginBottom: '15px'}}><SearchInfoSet callBack={searchHandle} props={searchInfo} /></div>
          <CustomTable
            keyColumn={keyColumn}
            values={selectedList}
            columns={titleRow}
            wordWrap={true}
            onRowClick={(e) => sendDetail(e, param)}
          />
        </div> )}
    </div>
  );
};
export default ElecAtrz;