import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import { Tooltip } from 'devextreme-react/tooltip';
import CustomTable from "components/unit/CustomTable";
import SearchInfoSet from "components/composite/SearchInfoSet";
import elecAtrzJson from "./ElecAtrzJson.json";
import ApiRequest from 'utils/ApiRequest';
import ElecAtrzHistPopup from "./common/ElecAtrzHistPopup";
import { useModal } from "../../components/unit/ModalContext";
import Popup from "devextreme-react/popup";
import TextArea from "devextreme-react/text-area";
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
  const { handleOpen } = useModal();
  
  /**
   * 승인, 반려 관련
   */
  const [ opnnCn, setOpnnCn ] = useState("");
  const [ aplyYmd, setAplyYmd ] = useState();
  const [ odr, setOdr ] = useState();
  const [ rjctPopupVisible, setRjctPopupVisible ] = useState(false);
  const [ aprvPopupVisible, setAprvPopupVisible ] = useState(false);
  const [ maxAtrzLnSn, setMaxAtrzLnSn ] = useState();
  const [ dtlInfo, setDtlInfo ] = useState({});

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
    getAllCount();
  }, []);

  const getAllCount = async () => {
    try {
      const response = await ApiRequest('/boot/common/queryIdSearch', { queryId: countQueryId, empId: empId });
      setTotalCount(response);
    } catch (error) {
      console.log('error', error);
    }
  }

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
  const deleteTempAtrz = async (data) => {
    const res = await ApiRequest('/boot/elecAtrz/deleteTempAtrz', {
      elctrnAtrzId: data.elctrnAtrzId, atrzTySeCd: data.elctrnAtrzTySeCd
    });
    if(res >= 1) {
      searchHandle(); 
      getAllCount();
      handleOpen("삭제되었습니다.");
    }
  }

  const onClickBtn = async (button, data) => {
    await getVacInfo(data);
    await getMaxAtrzLnSn(data);
    setAplyYmdOdr();

    if(button.name === 'delete'){
      handleOpen(button.msg, () => deleteTempAtrz(data), true);

    } else if(button.name === "docHist") {
      await onSetPopData(data);
      await onHistPopAppear();

    } else if(button.name === "aprv") {
      await onSetPopData(data)
      await onAprvPopup();

    } else if(button.name === "rjct") {
      await onSetPopData(data)
      await onRjctPopup();

    } else if(button.name === "recall") {
      handleOpen("회수 하시겠습니까?",  () => elctrnAtrzRecall(data), true);
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

  /**
   * 결재를 회수한다.
   */
  const elctrnAtrzRecall = async (data) => {
    /**
     * 1. 회수 가능: 결재선 1번라인이 심사중일 경우
     * 2. 
     */
    const param = [
      { tbNm: "ELCTRN_ATRZ" },
      {
        atrzDmndSttsCd: "VTW03701"
      },
      {
        elctrnAtrzId: data.elctrnAtrzId
      }
    ]

    try {
      const response = await ApiRequest("/boot/common/commonUpdate", param);
  
      if(response > 0) {
        handleOpen("회수되었습니다. 임시저장 목록에서 확인가능합니다.");
        searchHandle();
        getAllCount();
      } else {
        handleOpen("회수에 실패하였습니다. 관리자에게 문의해주세요");
      }

    } catch (error) {
      console.error(error);
    }
  }

  ////////////////////////////////////// 승인 반려 관련 //////////////////////////////////////
  // 반려팝업 호출
  const onRjctPopup = async () => {
      setRjctPopupVisible(true);
  }

  // 승인 팝업 호출
  const onAprvPopup = async () => {
      setAprvPopupVisible(true);
  }

  // 팝업 close
  const handleClose = () => {
      setRjctPopupVisible(false);
      setAprvPopupVisible(false);
      setOpnnCn("");
  };

  // 반려 의견 입력
  const onTextAreaValueChanged = useCallback((e) => {
      setOpnnCn(e.value);
  }, []);

  /**
   * 날짜 생성
   * @returns yyyyMMdd
   */
  const getToday = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return year + month + day;
  }

  /**
   * 최종 결재선 순번확인: 현재 결재자가 마지막 결재인지 확인하기 위함
   */
  const getMaxAtrzLnSn = async (data) => {
    const param = {
        queryId: "elecAtrzMapper.retrieveMaxAtrzLnSn",
        elctrnAtrzId: data.elctrnAtrzId
    }
    try {
        const response = await ApiRequest("/boot/common/queryIdSearch", param);
        if(response[0]) setMaxAtrzLnSn(response[0].maxAtrzLnSn);
    } catch (error) {
        console.error(error)
    }
  };

  const getVacInfo = async (data) => {
    try {
        const response = await ApiRequest('/boot/common/commonSelect', [
            { tbNm: "VCATN_ATRZ" }, { elctrnAtrzId: data.elctrnAtrzId }
        ]);
        setDtlInfo(response[0]);
    } catch (error) {
        console.log('error', error);
    }
  };


  /**
   * 승인 처리
   */
  const aprvAtrz = async () => {

    const isconfirm = window.confirm("요청을 승인하시겠습니까?");
    const date = getToday();
    const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
    const nowAtrzLnSn = selectedData.nowAtrzLnSn;

    /**
     * 휴가 결재일 경우 승인처리를 따로 해준다.
     */
    if(isconfirm) {
        if(selectedData.elctrnAtrzTySeCd === "VTW04901") {
          
          // 휴직 처리 분기
          if(selectedData.vcatnTyCd === "VTW05301" || selectedData.vcatnTyCd === "VTW05302" || selectedData.vcatnTyCd === "VTW05301" ) {
            /**
             * 휴직 승인 처리
             */
            const param = {
                empId: selectedData.atrzDmndEmpId,
                sessionEmpId: userInfo.empId,
                elctrnAtrzId: selectedData.elctrnAtrzId,
                vcatnTyCd: dtlInfo.vcatnTyCd,
                vcatnBgngYmd: dtlInfo.vcatnBgngYmd,
                vcatnEndYmd: dtlInfo.vcatnEndYmd,
                vcatnDeCnt: dtlInfo.vcatnDeCnt,
                mdfcnEmpId: userInfo.empId,
                atrzStepCd: selectedData.atrzStepCd,
                aprvParam: [
                    { tbNm: "ATRZ_LN" },
                    { 
                        atrzSttsCd: "VTW00802",
                        aprvYmd: date,
                        mdfcnDt: mdfcnDt,
                        mdfcnEmpId: userInfo.empId,
                        atrzOpnnCn: opnnCn,
                    },
                    { 
                        elctrnAtrzId: selectedData.elctrnAtrzId,
                        aprvrEmpId: userInfo.empId,
                        atrzLnSn: nowAtrzLnSn
                    }
                ]
            }

            const response = leaveAprvProcess(param).then((value) => {
                if(value[0].atrzLnSn > 0) {
                    upNowAtrzLnSn(value[0].atrzLnSn);
                } else {
                    handleOpen("승인 처리에 실패하였습니다.");
                    return;
                }
            });
          } else {
            /** 
             * 휴가결재  승인처리 
             */
            const param = {
                    empId: selectedData.atrzDmndEmpId,
                    elctrnAtrzId: selectedData.elctrnAtrzId,
                    vcatnTyCd: dtlInfo.vcatnTyCd,
                    vcatnBgngYmd: dtlInfo.vcatnBgngYmd,
                    vcatnEndYmd: dtlInfo.vcatnEndYmd,
                    mdfcnEmpId: userInfo.empId,
                    atrzStepCd: selectedData.atrzStepCd,
                    aprvParam: [
                      { tbNm: "ATRZ_LN" },
                      { 
                        atrzSttsCd: "VTW00802",
                        aprvYmd: date,
                        mdfcnDt: mdfcnDt,
                        mdfcnEmpId: userInfo.empId,
                        atrzOpnnCn: opnnCn,
                      },
                      { 
                        elctrnAtrzId: selectedData.elctrnAtrzId,
                        aprvrEmpId: userInfo.empId,
                            atrzLnSn: nowAtrzLnSn
                          }
                        ]
            }
            
            const response = vacAprvProcess(param).then((value) => {
                if(value[0].atrzLnSn > 0) {
                    upNowAtrzLnSn(value[0].atrzLnSn);
                  } else {
                    handleOpen("승인 처리에 실패하였습니다.");
                    return;
                  }
            });
          }
        } else if (selectedData.elctrnAtrzTySeCd === "VTW04915") {
            /**
             * 휴가취소 결재 승인 처리
             */
            const param = {
                empId: selectedData.atrzDmndEmpId,
                elctrnAtrzId: selectedData.elctrnAtrzId,
                atrzStepCd: selectedData.atrzStepCd,
                histElctrnAtrzId: selectedData.histElctrnAtrzId,
                mdfcnEmpId: userInfo.empId,
                aprvParam: [
                    { tbNm: "ATRZ_LN" },
                    { 
                        atrzSttsCd: "VTW00802",
                        aprvYmd: date,
                        mdfcnDt: mdfcnDt,
                        mdfcnEmpId: userInfo.empId,
                        atrzOpnnCn: opnnCn,
                    },
                    { 
                        elctrnAtrzId: selectedData.elctrnAtrzId,
                        aprvrEmpId: userInfo.empId,
                        atrzLnSn: nowAtrzLnSn
                    }
                ]
            }

            const response = vacCancelAprvProcess(param).then((value) => {
                if(value[0].atrzLnSn > 0) {
                    upNowAtrzLnSn(value[0].atrzLnSn);
                } else {
                    handleOpen("승인 처리에 실패하였습니다.");
                    return;
                }
            });
        } else {
              /** 
              * 휴가결재 / 휴가취소 외 승인처리 
              */
            const param = [
                { tbNm: "ATRZ_LN" },
                { 
                    atrzSttsCd: "VTW00802",
                    aprvYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: userInfo.empId,
                    atrzOpnnCn: opnnCn,
                },
                { 
                    elctrnAtrzId: selectedData.elctrnAtrzId,
                    aprvrEmpId: userInfo.empId,
                    atrzLnSn: nowAtrzLnSn
                }
            ]

            const response = aprvProcess(param).then((value) => {
                if(value.atrzLnSn > 0) {
                    // 단계 올리기
                    upNowAtrzLnSn(value.atrzLnSn);
                } else {
                    handleOpen("승인 처리에 실패하였습니다.");
                    return;
                }
            });
        }
    }
  }

  /**
   * 페이지를 리로드 해준다.
   */
  const reloadPage = async () => {
    navigate('/elecAtrz/ElecAtrz');
  }

  /**
   * 승인하는 프로세스
   * @param {*} param 
   * @returns 
   */
  const aprvProcess = async (param) => {
      const response = await ApiRequest("/boot/elecAtrz/aprvElecAtrz", param);
      return response;
  }

  /**
   * 휴가결재 승인 프로세스
   * @param {} param 
   * @returns 
   */
  const vacAprvProcess = async (param) => {
      const response = await ApiRequest("/boot/indvdlClm/updateVcatnMng", param);
      return response;
  }

  /**
   * 휴가결재취소 승인 프로세스
   * @param {*} param 
   * @returns 
   */
  const vacCancelAprvProcess = async (param) => {
      const response = await ApiRequest("/boot/indvdlClm/approvalReInsertVcatnAtrz", param);
      return response;
  }

  /**
   * 휴직 결재 승인 프로세스
   * @param {} param 
   * @returns 
   */  
  const leaveAprvProcess = async (param) => {
    const response = await ApiRequest("/boot/indvdlClm/updateEmpLeave", param);
    return response;
  }


  /**
   * 결재가 완료된 후 결재선 순번에 따라 현재 결재선 순번을 높여준다. 
   * @param {} nowAtrzLnSn : 현재 결재선 순번
   * @returns 
   */
  const upNowAtrzLnSn = async (nowAtrzLnSn) => {
    let updParam = {};
    if(nowAtrzLnSn > maxAtrzLnSn) {
        // max보다 승인이 끝난 뒤 결재선 순번이 크면 최종승인임.
        updParam = {
            atrzDmndSttsCd: "VTW03703",
            nowAtrzLnSn: maxAtrzLnSn,
            mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
            mdfcnEmpId: userInfo.empId
        }
    } else {
        // max와 현재가 다르면 중간승인임.
        updParam = {
            nowAtrzLnSn: nowAtrzLnSn,
            mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
            mdfcnEmpId: userInfo.empId
        }
    }

    const param = [
        { tbNm: "ELCTRN_ATRZ" },
        updParam,
        {
            elctrnAtrzId: selectedData.elctrnAtrzId
        }
    ]
    try {
        const response = await ApiRequest("/boot/common/commonUpdate", param);
        if(response > 0) {

            // 결재 취소나 변경결재가 아닌 경우
            if(selectedData.atrzHistSeCd != "VTW05405" && selectedData.atrzHistSeCd != "VTW05406") {

                // 청구결재이면서 촤종 숭인인 경우 프로젝트 비용에 내용을 반영해준다.
                if(selectedData.elctrnAtrzTySeCd === "VTW04907" && nowAtrzLnSn > maxAtrzLnSn) {
                    const clmResult = handlePrcjtCost();
                    if(clmResult < 0) {
                        handleOpen("승인 처리에 실패하였습니다.");
                    }
                }
            }

            // 결재 취소에 대한 최종 승인인 경우, 후속 처리를 진행한다.
            if(selectedData.atrzHistSeCd === "VTW05405" && nowAtrzLnSn > maxAtrzLnSn) {

                const param = {
                    atrzHistSeCd: selectedData.atrzHistSeCd,
                    histElctrnAtrzId: selectedData.histElctrnAtrzId,
                    elctrnAtrzTySeCd: selectedData.elctrnAtrzTySeCd
                }

                // 1. 이력 컬럼에 있는 전자결재에 대한 처리 -> 
                const response = await ApiRequest("/boot/elecAtrz/updateHistElctrnAtrz", param);

            }

            // 변경결재에 대한 최종 승인인 경우, 후속 처리를 진행한다.
            if(selectedData.atrzHistSeCd === "VTW05406" && nowAtrzLnSn > maxAtrzLnSn) {
                const param = {
                    atrzHistSeCd: selectedData.atrzHistSeCd,
                    histElctrnAtrzId: selectedData.histElctrnAtrzId,
                    elctrnAtrzTySeCd: selectedData.elctrnAtrzTySeCd
                }

                // 1. 이력 컬럼에 있는 전자결재에 대한 처리 -> 
                const response = await ApiRequest("/boot/elecAtrz/updateHistElctrnAtrz", param);

                if(selectedData.elctrnAtrzTySeCd === "VTW04907") {
                    const clmResult = handlePrcjtCost();
                    if(clmResult < 0) {
                        handleOpen("승인 처리에 실패하였습니다.");
                    }
                }
            }

            handleOpen("승인 처리되었습니다.");
            handleClose();
            searchHandle();
            getAllCount();
        } else {
            handleOpen("승인 처리에 실패하였습니다.");
            handleClose();
            return;
        }
        
    } catch (error) {
        console.error(error)
    }
  }

  /**
   * 반려 실행
   */
  const rjctAtrz = async () => {
    const isconfirm = window.confirm("요청을 반려하시겠습니까?");
    const date = getToday();
    const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

    const nowAtrzLnSn = selectedData.nowAtrzLnSn;
    if(isconfirm) {

        const param = [
            { tbNm: "ATRZ_LN" },
            { 
                atrzSttsCd: "VTW00803",
                atrzOpnnCn: opnnCn,
                rjctYmd: date,
                mdfcnDt: mdfcnDt,
                mdfcnEmpId: userInfo.empId,
            },
            { 
                elctrnAtrzId: selectedData.elctrnAtrzId,
                aprvrEmpId: userInfo.empId,
                atrzLnSn: nowAtrzLnSn
            }
        ]
        const result = await ApiRequest("/boot/common/commonUpdate", param);

        if(result > 0) {

            handleDmndStts(nowAtrzLnSn).then((value) => {
                console.log(value);
                if(value > 0) {

                    // 취소결재를 반려한 경우 후속조치
                    if(selectedData.atrzHistSeCd === "VTW05405") {
                        // HIST_ELCTRN_ATRZ_ID 의 값을 다시 결재중으로 변경
                        // HIST_ELCTRN_ATRZ_ID의 결재선을 다시 결재중으로 변경
                        
                        const param = {
                            elctrnAtrzId: selectedData.histElctrnAtrzId,
                            mdfcnDt: mdfcnDt,
                            mdfcnEmpId: userInfo.empId
                        }

                        const response = rollbackElctrnAtrz(param);
                    }
                    handleOpen("반려 처리되었습니다.");
                    navigate('/elecAtrz/ElecAtrz');
                    handleClose();
                } else {
                    handleOpen("반려 처리에 실패하였습니다.");
                    return;
                }
            });

        } else {
            handleOpen("반려 처리에 실패하였습니다.");
        }
    }
  }

  const handleDmndStts = async (nowAtrzLnSn) => {
      const date = getToday();
      const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
      const param = [
          { tbNm: "ELCTRN_ATRZ" },
          { 
              atrzDmndSttsCd: "VTW03704",
              mdfcnDt: mdfcnDt,
              mdfcnEmpId: userInfo.empId,
          },
          { 
              elctrnAtrzId: selectedData.elctrnAtrzId,
              nowAtrzLnSn: nowAtrzLnSn
          }
      ]
      const result = await ApiRequest("/boot/common/commonUpdate", param);
      return result;
  }

  /**
   * 취소결재, 변경결재 반려로 인해 관련 전자결재를 원래대로 돌려준다.
   * @param {} param 
   * @returns 
   */
  const rollbackElctrnAtrz = async (param) => {

      return await ApiRequest("/boot/elecAtrz/rollbackElctrnAtrz", param);
  }

  /**
   * 청구결재 최종 승인 시 프로젝트 비용청구 테이블에 
   */
  const handlePrcjtCost = async () => {

      const regDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];
      const regEmpId = userInfo.empId;

      const param = {
          aplyYm: aplyYmd,
          aplyOdr: odr,
          elctrnAtrzId: selectedData.elctrnAtrzId,
          prjctId: selectedData.prjctId,
          empId: selectedData.atrzDmndEmpId,
          regDt: regDt,
          regEmpId: regEmpId
      }
      
      try {
          const result = await ApiRequest("/boot/elecAtrz/insertPrjctCt", param);
          return result;
      } catch (error) {
          console.error(error);
      }
  }

  /**
   * 청구결재용 청구 연월, 차수 생성
   */
  const setAplyYmdOdr = () => {
      const today = new Date();

      let year = today.getFullYear();
      let month = today.getMonth() + 1; 
      const day = today.getDate();
      let odr;
      let nextOdr

      if (day <= 15) {
          odr = 2;
      } else {
          odr = 1;
      }
      
      if (month === 1) {
          if(day <= 15) {
              month = 12; // 1월인 경우 이전 연도 12월로 설정
              year--;
          } else {

          }
      } else {
          if(day <= 15) {
              month--; // 2월 이상인 경우 이전 월로 설정
          } 
      }

      // 월을 두 자리 숫자로 표현합니다.
      const monthString = (month < 10 ? '0' : '') + month;
      
      setAplyYmd(`${year}${monthString}`);
      setOdr(odr);
  }

  return (
    <div style={{marginBottom: '10%'}}>
      <div style={{ marginBottom: "15px", display: 'flex' }}>
        <div className='title' style={{marginRight: '20px'}}>전자결재</div>
        <Button text="신규 기안 작성" onClick={onNewReq} type='danger'></Button>
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
      <Popup
          width={"80%"}
          height={"80%"}
          visible={aprvPopupVisible}
          onHiding={handleClose}
          showCloseButton={true}
          title={"승인 의견"}
      >
          <TextArea 
              height="50%"
              valueChangeEvent="change"
              onValueChanged={onTextAreaValueChanged}
              placeholder="승인 의견을 입력해주세요."
          />
          <br/>
          <div className="buttons" align="right" style={{ marginTop: "20px" }}>
            <Button 
                text="Contained"
                type="default"
                stylingMode="contained"
                style={{ margin: "2px" }}  
                onClick={ () => {
                  aprvAtrz()
                  reloadPage()
                }}
                >
                승인
                </Button>
            <Button 
                text="Contained"
                type="default"
                stylingMode="contained"
                style={{ margin: "2px" }}
                onClick={handleClose}
                >
                취소
            </Button>
          </div>
      </Popup>
      <Popup
          width={"80%"}
          height={"80%"}
          visible={rjctPopupVisible}
          onHiding={handleClose}
          showCloseButton={true}
          title={"반려 사유"}
      >
          <TextArea 
              height="50%"
              valueChangeEvent="change"
              onValueChanged={onTextAreaValueChanged}
              placeholder="반려 사유를 입력해주세요."
          />
          <br/>
          <div className="buttons" align="right" style={{ marginTop: "20px" }}>
            <Button 
                text="Contained"
                type="default"
                stylingMode="contained"
                style={{ margin: "2px" }} 
                onClick={ () => {
                  rjctAtrz()
                  reloadPage()
                }}
                >
                반려
            </Button>
            <Button                     
                text="Contained"
                type="default"
                stylingMode="contained"
                style={{ margin: "2px" }} 
                onClick={handleClose}
                >
                취소
            </Button>
          </div>
      </Popup>
      <ElecAtrzHistPopup
        visible={histPopVisible}
        onPopHiding={onHistPopHiding}
        selectedData={selectedData}
        sttsCd={param.sttsCd}
      />
    </div>
  );
};
export default ElecAtrz;