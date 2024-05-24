import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import { Tooltip } from 'devextreme-react/tooltip';
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet";
import elecAtrzJson from "./ElecAtrzJson.json";
import ApiRequest from 'utils/ApiRequest';
import ElecAtrzHistPopup from "./common/ElecAtrzHistPopup";
import "./ElecAtrz.css";

const ElecAtrz = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const empId = userInfo.empId;
  const { keyColumn, queryId, countQueryId, barList, searchInfo, baseColumns } = elecAtrzJson.elecMain;
  const [ param, setParam ] = useState({
    queryId: queryId,
    empId: empId,
    refer: null,
    sttsCd: 'VTW00801'
  });
  const [ clickBox, setClickBox ] = useState(null);
  const [ titleRow, setTitleRow ] = useState([]);
  const [ totalCount, setTotalCount ] = useState([]);
  const [ selectedList, setSelectedList ] = useState([]);

  /**
   * 이력 팝업 관련
   */
  const [ histPopVisible, setHistPopVisible ] = useState(false);
  const [ selectedData, setSelectedData ] = useState([]);

  const onNewReq = async () => {
    navigate("../elecAtrz/ElecAtrzForm");
  };

  useEffect(() => {
    setTitleRow(baseColumns.concat(elecAtrzJson.elecMain['progressApproval']))
  }, []);

  useEffect(() => {
    const getAtrz = async () => {
      try {
        const response = await ApiRequest('/boot/common/queryIdSearch', param)
        if (response) {
          setSelectedList(response)
        } else{
          setSelectedList([])
        }
      } catch (error) {
        console.log('error', error)
      }
    };
    getAtrz();
  }, [param])

  const searchHandle = async (initParam) => {
    setParam({
      ...param,
      ...initParam
    });
  };

  useEffect(() => {
    const getAllCount = async () => {
      try {
        const response = await ApiRequest('/boot/common/queryIdSearch', { queryId: countQueryId, empId: empId });
        setTotalCount(response);
      } catch (error) {
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
      <div style={{ width }}>
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
          {totalCount.length !== 0 && (totalCount[0][keyNm] === 0 ? 0 : <span>{totalCount[0][keyNm]}</span>)} 건
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
    if(e.event.target.className === "dx-button-content" || e.event.target.className === "dx-button-text") {
      return;
    } else {
      if (e.data.atrzDmndSttsCd === 'VTW03701') {  //임시저장
        navigate('/elecAtrz/ElecAtrzNewReq', { state: { formData: e.data, sttsCd: param.sttsCd, prjctId: e.data.prjctId } });
      } else {
        navigate('/elecAtrz/ElecAtrzDetail', { state: { data: e.data, sttsCd: param.sttsCd, prjctId: e.data.prjctId, refer: param.refer } });
      }
    }
  };

  const onClickBtn = async (button, data) => {
    if(button.name === 'delete'){
      const res = await ApiRequest('/boot/elecAtrz/deleteTempAtrz', {
        elctrnAtrzId: data.elctrnAtrzId, atrzTySeCd: data.elctrnAtrzTySeCd
      });
      if(res >= 1) getList();
    } else if(button.name === "docHist") {
      await onSetPopData(data);
      await onHistPopAppear();
    }
  }

  const onHistPopHiding = async () => {
    setHistPopVisible(false);
  }

  const onHistPopAppear = async () => {
    setHistPopVisible(true);
  }

  const onSetPopData = async (data) => {
    setSelectedData(data);
  }

  return (
    <div style={{marginBottom: '10%'}}>
      <div className="title p-1" style={{ marginTop: "10px", marginBottom: "10px" }} ></div>
      <div className="col-md-10 mx-auto" style={{ marginBottom: "15px", display: 'flex' }}>
        <h3 style={{ marginRight: '50px' }}>전자결재</h3>
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
              />))}
          </ElecBar>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}><SearchInfoSet callBack={searchHandle} props={searchInfo} /></div>
        <CustomTable
          keyColumn={keyColumn}
          values={selectedList.length !== 0 ? selectedList : []}
          columns={titleRow}
          wordWrap={true}
          noDataText={'결재 기안 문서가 없습니다.'}
          onClick={onClickBtn}
          onRowClick={(e) => sendDetail(e, param)}
        />
      </div>
      <ElecAtrzHistPopup
        visible={histPopVisible}
        onPopHiding={onHistPopHiding}
        data={selectedData}
        param={param}
      />
    </div>
  );
};
export default ElecAtrz;