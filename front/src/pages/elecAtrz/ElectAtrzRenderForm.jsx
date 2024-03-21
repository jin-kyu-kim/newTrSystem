import React, { useState, useEffect } from 'react';
import Form, {
    Item, GroupItem, Label, FormTypes, SimpleItem
} from 'devextreme-react/form';

import ApiRequest from 'utils/ApiRequest';

import { Button } from 'devextreme-react/button';

const ElectAtrzRenderForm = ({formList, onExample, onFormClick}) => {

    const [docSeCd, setDocSeCd] = useState([]);
    // const onExample = (data) => {
    //     console.log(data)
    // }

    // const onFormClick = () => {

    // }
    useEffect(() => {
        retriveDocSeCd();
    }, []);

    /**
     * 문서구분코드를 가져온다.
     */
    const retriveDocSeCd = async () => {
        const param = [
            { tbNm: "CD" },
            { upCdValue: "VTW034" }
        ]

        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setDocSeCd(response);
        } catch (error) {
            console.error(error)
        }
    }


    const renderDocSe = () => {

        const result = [];
 
        // 문서 구분 코드에 따라서 구분한다.
        for(let i = 0; i < docSeCd.length; i++) {
            result.push(
                <>
                    <div>* {docSeCd[i].cdNm}</div>
                    <div className="elecAtrz-from-container">
                        {renderForm(docSeCd[i].cdValue)}
                    </div>
                </>
            )
        }
        return result;

    }

    const renderForm = (cd) => {
        const result = [];
        console.log(cd)

        formList.map((data) => {
            if(data.docSeCd === cd) {
                result.push(
                    <div className='elecAtrz-from-container-box' style={{minHeight: "100px"}}>
                        <div 
                            style={{textAlign: "center"
                                    , padding: "20px"
                                    , minHeight:"150px"
                                    , minWidth: "100px"
                                    , width: "100%"
                                    , border: "solid black 1px"
                                    , cursor: "pointer"}}   
                        >
                            {/* <div style={{textAlign: "left", marginBottom: "20px"}} onClick={() => onExample(data)}>
                                미리보기
                            </div> */}

                            <div onClick={onFormClick} style={{marginBottom: "20px"}}>
                                {data.gnrlAtrzTtl}
                            </div>
                            <div>
                                {/* <Button text={"미리보기"} onClick={() => onExample(data)}/> */}
                                <Button text={"기안하기"} onClick={() => onFormClick(data)}/>
                            </div>
                        </div>
                    </div>
                )
            }
        });
        return result;
    }

    return (
        <>
            {/* <div>
                * 계약
            </div>
            <div className="elecAtrz-from-container">
                    {renderForm('VTW03401')}
            </div>
            <div>
                * 지급
            </div>
            <div>
                * 품의
            </div>
            <div>
                * 인사/지원
            </div>
            <div className="elecAtrz-from-container">
                    {renderForm('VTW03401')}
            </div>
            <div>
                * 경비
            </div>
            <div className="elecAtrz-from-container">
                    {renderForm('VTW03403')}
            </div> */}
            {renderDocSe()}
        </>
    )
}

export default ElectAtrzRenderForm;