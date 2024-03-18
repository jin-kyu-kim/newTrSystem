import Button from "devextreme-react/button";
import DateBox from 'devextreme-react/date-box';
import CultureHealthCostJson from "./CultureHealthCost.json";
import React, {useEffect, useState} from "react";
import CustomCdComboBox from "../../components/unit/CustomCdComboBox";
import {FileUploader, NumberBox} from "devextreme-react";
import uuid from "react-uuid";
import CustomTable from "../../components/unit/CustomTable";
import {TextBox} from "devextreme-react/text-box";
import ApiRequest from "../../utils/ApiRequest";
import {useCookies} from "react-cookie";
  const thStyle = {
    backgroundColor: '#f5f5f5',
    color: '#666666',
    fontWeight: 'bold',
    textAlign: 'center',
    border : '1px solid #dddddd',
    fontSize: 14
  };
  const inputStyle = {
    backgroundColor: 'white',
    width: '100%',
    height: '50px',
    border : '1px solid #dddddd',
    borderRadius : '5px',
    fontSize: 14
  }
  const tdStyle = {
    border : '1px solid #dddddd'
  }
  const empListContainerStyle = {
      width: "60%",
      marginTop: "20px",
  };
  const empDetailContainerStyle = {
      width: "40%",
      display: "flex",
      flexDirection: "column",
      marginTop: "20px",
  };
  const fontSize = {
      fontSize: 14
  }
  const button = {
      backgroundColor: '#446E9B',
      borderRadius: '5px',
      color: '#fff',
      width: '80px',
      marginTop: '20px',
      marginRight: '15px'
  }

const CultureHealthCost = () => {
    const [cookies] = useCookies([]);

    const [values, setValues] = useState([]);
    const [pageSize] = useState(10);
    var date = new Date();
    var firstDayOfMonth = new Date( date.getFullYear(), date.getMonth() , 1 );
    var lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
    const Json = CultureHealthCostJson;
    const [initParam, setInitParam] = useState({
        "clmAmt": 0,
        "clmYmd": date.getFullYear()+('0' + (date.getMonth() + 1)).slice(-2)+('0' + date.getDate()).slice(-2),
    });

    const getDate = () => {
        return date.getFullYear()+"/"+('0' + (date.getMonth() + 1)).slice(-2)+"/"+('0' + date.getDate()).slice(-2)
    }

    const getMonth = () => {
        if(1 <= date.getMonth()+1 <= 5){
            return date.getFullYear()+"/"+('0' + (date.getMonth()+1)).slice(-2);
        } else if (6 <= date.getMonth()+1){
            return lastMonth.getFullYear()+"/"+('0' + (lastMonth.getMonth()+1)).slice(-2)+", "+date.getFullYear()+"/"+('0' + (date.getMonth()+1)).slice(-2);
        }
    }

    const handleChgState = ({name, value}) => {
        setInitParam({
            ...initParam,
            [name] : value,
        });
    };

    const handleAttachmentChange = ({name, value}) => {
        setInitParam({
            ...initParam,
            atchmnflId: uuid(),
            empId: cookies.userInfo
        });
    };

    const costInsert = async() => {
        console.log(initParam);
        const confirmResult = window.confirm("등록하시겠습니까?");
        if (confirmResult) {
            const params = [{ tbNm: "CLTUR_PHSTRN_ACT_CT_REG" }, initParam];
            try {
                const response = await ApiRequest("/boot/common/commonInsert", params);
                if (response === 1) {
                    window.alert("등록되었습니다.")
                } else {
                    // 저장 실패 시 처리
                }
            } catch (error) {
                console.log(error);
                // 저장 실패 시 처리
            }
        }
    };

    return (
        <div className="container">
            <div style={{display: "flex"}}>
                <div className="empListContainer" style={empListContainerStyle}>
                    <div className="empListTable" style={{minWidth: "480px"}}>
                        <div style={{height: "290px"}}>
                            <p><strong>* 청구 목록 </strong></p>
                            <span style={fontSize}>
                            1. 입력, 수정, 삭제 가능 조건 <br/>
                              <strong>매달 1일 부터 5일 : 이전달과 현재달 청구 건</strong><br/>
                              <strong>매달 6일부터 말일 : 현재 달 청구 건</strong><br/>
                            <br/>
                               * 현재날짜 : <span
                                style={{color: "red"}}>{getDate()}</span><br/>
                            * 입력, 수정 및 삭제 가능한 청구대상 월 : <span style={{color: "red"}}>{getMonth()}</span><br/>
                        </span>
                        </div>
                        <CustomTable
                            keyColumn={Json.keyColumn}
                            pageSize={pageSize}
                            columns={Json.tableColumns}
                            values={values}
                            // onRowDblClick={onRowDblClick}
                            paging={true}
                        />
                    </div>
                </div>
                <form style={empDetailContainerStyle} onSubmit={costInsert}>
                    <div style={{height: "290px"}}>
                        <p><strong>* 문화 체련비 등록</strong></p>
                        <div style={fontSize}>
                            <p>1. 체력 향상과 문화 교육을 위해 지원하는 경비입니다.</p>
                            <p>2. 월 20만원 한도로 지급된 법인카드를 통해서만 이용 가능합니다.</p>
                            <p>3. <strong>체력단련비 : 헬스/요가/수영/필라테스</strong>와 같이 월단위 이상 수강/강습을 지원합니다.<br/>
                                <strong>(일회성 경비나 쿠폰은 문화비로 전환하여 지급합니다.)</strong><br/></p>
                            <p>4. <strong>문화비 :</strong> 문화 교육과 어학 강습을 지원하며 월 단위 이상 관인학원에 한합니다.<br/>
                                <strong>(문화비의 경우 매월 상여로 처리하며 연말정산 시 본인이 세금을 부담합니다.)</strong></p>
                        </div>
                    </div>
                    <table style={{border: '1px solid #dddddd'}}>
                        <colgroup>
                            <col width="25%"/>
                            <col width="75%"/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th style={thStyle}>청구일자</th>
                            <td style={tdStyle}>
                                <DateBox
                                    value={initParam?.clmYmd}
                                    onValueChanged={(e) => handleChgState({ name: "clmYmd", value: e.value })}
                                    inputAttr={Json.dateLabel}
                                    type="date"
                                    style={{backgroundColor: 'white'}}
                                />
                                <span style={{color: "red", fontSize: 14, fontWeight: "bold"}}>*법인카드로 결제한 날짜를 입력해 주세요.</span>
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>청구금액</th>
                            <td style={tdStyle}>
                                <NumberBox
                                    value={initParam?.clmAmt}
                                    onValueChanged={(e) => handleChgState({ name: "clmAmt", value: e.value })}
                                    inputAttr={Json.withSpinAndButtonsLabel}
                                    style={{backgroundColor: 'white'}}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>구분</th>
                            <td style={tdStyle}>
                                <CustomCdComboBox
                                    param="VTW041"
                                    placeholderText="구분"
                                    name="clturPhstrnSeCd"
                                    onSelect={handleChgState}
                                    value={initParam?.clturPhstrnSeCd}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>항목</th>
                            <td style={tdStyle}>
                                <TextBox style={inputStyle} placeholder="항목" value={initParam?.actIem} onValueChanged={(e) => handleChgState({ name: "actIem", value: e.value })}/>
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>목적</th>
                            <td style={tdStyle}>
                                <TextBox style={inputStyle} placeholder="목적" value={initParam?.actPurps} onValueChanged={(e) => handleChgState({ name: "actPurps", value: e.value })}/>
                            </td>
                        </tr>
                        <tr>
                            <th style={thStyle}>첨부파일</th>
                            <td style={tdStyle}>
                                <FileUploader
                                    multiple={true}
                                    accept="*/*"
                                    uploadMode="useButton"
                                    onValueChanged={handleAttachmentChange}
                                    maxFileSize={1.5 * 1024 * 1024 * 1024}
                                >
                                </FileUploader>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button style={button} text="저장" useSubmitBehavior></Button>
                        <Button style={button} text="초기화"></Button>
                    </div>
                    <div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CultureHealthCost;