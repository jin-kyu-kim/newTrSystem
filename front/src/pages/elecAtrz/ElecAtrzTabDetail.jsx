import { useEffect, useState } from 'react';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css';
import CustomTable from 'components/unit/CustomTable';
import CustomEditTable from 'components/unit/CustomEditTable';


const ElecAtrzTabDetail = ({ dtlInfo, detailData }) => {
    const { vacDtl, clmColumns } = electAtrzJson.electAtrzDetail;
    
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

    const ClmTab = ({columns}) => {
        return(
            <CustomEditTable
                columns={columns}
                values={[{}]}
                noEdit={true}
            />
        );
    };

    return (
        <div>
            {dtlInfo && detailData.elctrnAtrzTySeCd === 'VTW04901' 
            ? <VacInfoTab vacDtl={vacDtl} dtlInfo={dtlInfo} />
            : detailData.elctrnAtrzTySeCd === 'VTW04907' && 
                <ClmTab columns={clmColumns}/>
            }
        </div>
    );
}
export default ElecAtrzTabDetail;