import React, { useState, useEffect } from 'react';
import Form, {
    Item, GroupItem, Label, FormTypes, SimpleItem
} from 'devextreme-react/form';
// import "../ElecAtrzFormManageStyles.css";

import ApiRequest from 'utils/ApiRequest';

import { Button } from 'devextreme-react/button';

const ElectAtrzRenderForm = ({formList, onFormClick}) => {

    const [docSeCd, setDocSeCd] = useState([]);

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
                <div key={docSeCd[i].cdValue}>
                    <div>* {docSeCd[i].cdNm}</div>
                    <div className="elecAtrz-from-container">
                        {renderForm(docSeCd[i].cdValue)}
                    </div>
                </div>
            )
        }
        return result;

    }

    const renderForm = (cd) => {
        const result = [];

        formList.map((data, index) => {
            if(data.docSeCd === cd) {
                result.push(
                    <div key={data.atrzFormDocId} className='elecAtrz-from-container-box' style={{minHeight: "100px"}} >
                        <div 
                            style={{textAlign: "center"
                                    , padding: "20px"
                                    , minHeight:"150px"
                                    , minWidth: "100px"
                                    , width: "100%"
                                    , border: "solid grey 1px"
                                    , backgroundColor: "rgba(225, 239, 243, 0.4)"
                                    , cursor: "pointer"}}   
                        >
                    
                            <div>
                                <Button
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "110px",
                                    padding: "10px 10px",
                                    cursor: "pointer",
                                    backgroundColor: "white",
                                    whiteSpace: "normal"
                                }} text={data.gnrlAtrzTtl} onClick={() => onFormClick(data)}/>
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
            {renderDocSe()}
        </>
    )
}

export default ElectAtrzRenderForm;