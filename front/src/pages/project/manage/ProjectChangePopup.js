import React, {useEffect, useState} from 'react';

import CustomLabelValue from '../../../components/unit/CustomLabelValue';
import CustomCdComboBox from '../../../components/unit/CustomCdComboBox';

const ProjectChangePopup = ({selectedItem, period, labelValue, popupInfo}) => {

    const [data, setData] = useState([]);
    const [param, setParam] = useState([]);
    const [contents, setContents] = useState([]);

    // if(selectedItem !== null) {
    // console.log("selectedItem.expensCdNm",selectedItem.expensCd);
    // }
    // console.log("popupInfo",popupInfo);


    const handleChgState = ({name, value}) => {

        // if(!readOnly) {

            setData({
                ...data,
                [name] : value
            });
            // console.log("data",data);
            
            setParam({
                ...param,
                [name] : value
            })
        // }
    };

    useEffect(() => {
        if(popupInfo.menuName==="ProjectGeneralBudgetCostJson" || popupInfo.menuName==="ProjectControlBudgetCostJson"){
            setContents(
                <div className="dx-fieldset">
                    <div className="dx-field">
                        <div className="dx-field-label asterisk">비용코드</div>
                        <div className="dx-field-value">
                            <CustomCdComboBox
                                param="VTW045"
                                placeholderText="비용코드"
                                name="expensCdNm"
                                onSelect={handleChgState}
                                value={selectedItem !== null ? selectedItem.expensCd : null}
                            />
                        </div>
                    </div>
                    <CustomLabelValue props={popupInfo.labelValue.dtlDtls} value={selectedItem !== null ? selectedItem.dtlDtls : null} onSelect={handleChgState}/>
                    <CustomLabelValue props={popupInfo.labelValue.bgtMngOdr} value={selectedItem !== null ? selectedItem.bgtMngOdr : null} onSelect={handleChgState}/>
                </div>
            );
        }else if(popupInfo.menuName==="ProjectOutordCompanyCostJson"){
        }else if(popupInfo.menuName==="ProjectOutordEmpCostJson"){
        }else if(popupInfo.menuName==="ProjectEmpCostJson"){
        }else{
            return;
        }
    }, [popupInfo.menuName, selectedItem]); 
    


    return (
        <div className="popup-content">
            <div className="project-regist-content">
                <div className="project-change-content-inner-left">
                    <h3>* 1번 그룹</h3>

                    {contents}

                </div>
                <div className="project-change-content-inner-right">
                    <h3>* 2번 그룹 </h3>
                    <div className="dx-fieldset">
                        <div className="dx-field">
                            <div className="dx-field-label">사업수행유형</div>
                            <div className="dx-field-value">
                                55555
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectChangePopup;