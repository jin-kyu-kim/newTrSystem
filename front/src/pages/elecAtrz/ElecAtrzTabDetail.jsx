import { useEffect, useState } from 'react';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css';
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzCtrtInfoDetail from './ctrtInfo/ElecAtrzCtrtInfoDetail';


const ElecAtrzTabDetail = ({ dtlInfo, detailData, sttsCd, prjctId, ctrtTyCd }) => {
    const { vacDtl, clmColumns,  groupingColumn, groupingData, ctrtInfo } = electAtrzJson.electAtrzDetail;
    const [ data, setData ] = useState([]);

    /* ===================================  필요 데이터 조회  ====================================*/
    useEffect(() => {

        /* 경비 청구 */
        if(["VTW04907"].includes(detailData.elctrnAtrzTySeCd)){
            const getExpensClm = async () => {
                try {
                    const response = await ApiRequest('/boot/common/queryIdSearch', 
                        {queryId: "elecAtrzMapper.retrieveElctrnAtrzExpensClm"
                         ,elctrnAtrzId: detailData.elctrnAtrzId}
                    );
                    setData(response);
                    console.log("response",response);
    
                } catch (error) {
                    console.log('error', error);
                }
            };
            getExpensClm();

        /* 재료비 계약, 외주업체 계약, 외주인력 계약 */
        } else if(["VTW04908","VTW04909","VTW04910","VTW04914"].includes(detailData.elctrnAtrzTySeCd)){
            const elctrnAtrzId = detailData.ctrtElctrnAtrzId ? detailData.ctrtElctrnAtrzId : detailData.elctrnAtrzId;
            const getCtrtInfo = async () => {
                try {
                    const response = await ApiRequest('/boot/common/commonSelect', 
                                     [{ tbNm: "CTRT_ATRZ" }, { elctrnAtrzId: elctrnAtrzId }]
                    );
                    setData(response);
                    console.log("response",response);
    
                } catch (error) {
                    console.log('error', error);
                }
            };
            getCtrtInfo();
        }
        
    }, []);
 

    /**
     *  경비청구 테이블의 그룹핑 컬럼 커스터마이징
     */
    const groupingCustomizeText = (e) => {
        if (e.value === "VTW01901") {
            return "기업법인카드";
          }else if (e.value === "VTW01902") {
            return "개인현금지급";
          } else if (e.value === "VTW01903") {
            return "개인법인카드";
          } else {
            return "세금계산서/기타";
          } 
      }

    /**
     *  경비청구 화면그리기
     */
    const ClmTab = ({columns, groupingColumn}) => {
        return(
            <div>
            <CustomTable
                columns={columns}
                values={data}
                grouping={groupingColumn}
                keyColumn={"rowId"}
                groupingData={groupingData}
                groupingCustomizeText={groupingCustomizeText}
                wordWrap={true}
            />
            </div>
        );
    };

    /* ===================================  휴가  ====================================*/
    /**
     *  휴가정보 화면 그리기
     */
    const VacInfoTab = ({ vacDtl, dtlInfo }) => {
        return (
            <div className="dtl-table">
                {vacDtl.map((vac, index) => (
                    <div style={{ display: 'flex' }} key={index}>
                        <div className="dtl-first-col">{vac.value}</div>
                        <div className="dtl-val-col">

                            {dtlInfo[vac.key]}

                            <div style={{display: 'flex'}}>
                                {vac.key === 'dateRange' && (
                                    vac.info.map((item, index) => (
                                        <div style={{display: 'flex'}} key={index}>
                                            <div>{dtlInfo[item.key]}</div>
                                            <span className='lt-rt-margin'>{item.text}</span>
                                        </div>
                                    )))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    /* ===================================  재료비, 외주업체 계약  ====================================*/
    /**
     *  재료비, 외주업체 화면 그리기
     */
    const CtrtInfo = ({ctrtInfo})=>{
        if(detailData.elctrnAtrzTySeCd === 'VTW04910' || ctrtTyCd === 'VTW04910'){ //재료비
            ctrtInfo = ctrtInfo.filter(item => item.value !== '계약기간');
        }
        return(
            <div className="elecAtrzNewReq-ctrtInfo">
                
                {ctrtInfo.map((ctrt, index) => (
                    <div style={{ display: 'flex' }} key={index}>
                        <div className="dtl-first-col">{ctrt.value}</div>
                        <div className="dtl-val-col">

                        {data && data[0] && data[0][ctrt.key] ? (
                            <>{data[0][ctrt.key]}</>
                        ) : (
                            <div> </div>  
                        )}

                        {data && data[0] ? (                      
                        <div style={{display: 'flex'}}>
                            {ctrt.key === 'CustomValue' && (
                                    ctrt.info.map((item, index) => (
                                        <div style={{display: 'flex'}} key={index}>
                                            <div>{data[0][item.key]}</div>
                                            <span className='lt-rt-margin'>{item.text}</span>
                                        </div>
                            )))}
                        </div>     
                         ) : (
                             <div> </div>  
                        )}
          
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    /* ================  전자결재유형코드에 따른 특수 컴포넌트 렌더링  =================*/

    const renderSpecialComponent = () => {

        switch (detailData.elctrnAtrzTySeCd) {
            case 'VTW04901':
                return <VacInfoTab vacDtl={vacDtl} dtlInfo={dtlInfo} />;
            case 'VTW04907':
                return <ClmTab columns={clmColumns} groupingColumn={groupingColumn}/>;
            case 'VTW04909':
            case 'VTW04910':
            case 'VTW04914':
                return  <>
                        <h3>계약정보</h3>
                        <CtrtInfo ctrtInfo={ctrtInfo} data={data} ctrtTyCd={ctrtTyCd}/>
                        <ElecAtrzCtrtInfoDetail data={detailData} sttsCd={sttsCd} prjctId={prjctId} ctrtTyCd={ctrtTyCd}/>
                        </>
            default:
                return null;
        }   
    }

    return (
        <div>
            {renderSpecialComponent()}
        </div>
    );
}
export default ElecAtrzTabDetail;