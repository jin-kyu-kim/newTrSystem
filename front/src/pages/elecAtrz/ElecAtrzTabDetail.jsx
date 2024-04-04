import { useEffect, useState } from 'react';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css';
import CustomTable from 'components/unit/CustomTable';


const ElecAtrzTabDetail = ({ dtlInfo, detailData }) => {
    const { vacDtl, clmColumns,  groupingColumn, keyColumnClm, groupingData  } = electAtrzJson.electAtrzDetail;
    const [ expensClmInfo, setExpensClmInfo ] = useState([]);

    /**
     *  경비청구 데이터 조회
     */
    useEffect(() => {
        const getExpensClm = async () => {
            try {
                const response = await ApiRequest('/boot/common/queryIdSearch', 
                    {queryId: "elecAtrzMapper.retrieveElctrnAtrzExpensClm"
                     ,elctrnAtrzId: detailData.elctrnAtrzId}
                );
                setExpensClmInfo(response);
                console.log("response",response);

            } catch (error) {
                console.log('error', error);
            }
        };
        getExpensClm();
    }, []);

    
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

    /**
     *  청구 테이블의 그룹핑 컬럼 커스터마이징
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
     *  청구 
     */
    const ClmTab = ({columns, groupingColumn}) => {
        return(
            <div>
            <CustomTable
                columns={columns}
                values={expensClmInfo}
                grouping={groupingColumn}
                keyColumn={"rowId"}
                groupingData={groupingData}
                groupingCustomizeText={groupingCustomizeText}
            />
            </div>
        );
    };


    return (
        <div>
            {dtlInfo && detailData.elctrnAtrzTySeCd === 'VTW04901' 
            ? <VacInfoTab vacDtl={vacDtl} dtlInfo={dtlInfo} />
            : detailData.elctrnAtrzTySeCd === 'VTW04907' && 
            <ClmTab columns={clmColumns} groupingColumn={groupingColumn}/>
            }
        </div>
    );
}
export default ElecAtrzTabDetail;