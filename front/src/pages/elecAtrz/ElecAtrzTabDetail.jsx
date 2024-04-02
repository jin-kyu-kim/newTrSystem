import { useEffect, useState } from 'react';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css';


const ElecAtrzTabDetail = ({ detailData }) => {
    const { vacDtl } = electAtrzJson.electAtrzDetail;
    const [ dtlInfo, setDtlInfo ] = useState({});
    
    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await ApiRequest('/boot/common/commonSelect', [
                    { tbNm: "VCATN_ATRZ" }, { elctrnAtrzId: detailData.elctrnAtrzId }
                ]);
                setDtlInfo(response[0]);
            } catch (error) {
                console.log('error', error);
            }
        };
        getInfo();
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

    return (
        <div>
            {detailData.elctrnAtrzTySeCd === 'VTW04901' &&
                <VacInfoTab vacDtl={vacDtl} dtlInfo={dtlInfo} />
            }
        </div>
    );
}
export default ElecAtrzTabDetail;