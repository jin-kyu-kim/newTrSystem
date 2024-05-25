import React, { useState, useEffect } from "react";
import { Popup } from "devextreme-react";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";
import ElecAtrzHistPopupJson from "./ElecAtrzHistPopupJson.json";
import { useNavigate } from 'react-router-dom';

const ElecAtrzHistPopup = ({ visible, onPopHiding, selectedData }) => {

    const { queryId, keyColumn, columns } = ElecAtrzHistPopupJson;
    const [ values, setValues ] = useState([]);
    const navigate = useNavigate ();


    useEffect(() => {
            retrieveAtrzHist();
    }, [selectedData]);

    const retrieveAtrzHist = async () => {

        const param = {
            queryId: queryId,
            elctrnAtrzId: selectedData.elctrnAtrzId
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", param); 
        setValues(response);
    }

    const onClickBtn = async (e, data) => {

        const param = {
            queryId: "elecAtrzMapper.retrieveAtrzHist",
            empId: data.empId,
            sttsCd: "VTW03703",
            elctrnAtrzId : data.histElctrnAtrzId
        }

        let detailData = await ApiRequest("/boot/common/queryIdSearch", param);
        onPopHiding();
        navigate('/elecAtrz/ElecAtrzDetail', { state: { data: detailData[0], sttsCd: data.atrzHistSeCd === "VTW05405" ? "VTW03705" : "VTW03706", prjctId:detailData[0].prjctId, refer: null}})
        
    }

    const renderDocHist = () => {
        return (
            <div>
                <CustomTable
                    keyColumn={keyColumn}
                    values={values.length !== 0 ? values : []}
                    columns={columns}
                    wordWrap={true}
                    onClick={onClickBtn}
                />
                <div className="buttons" align="right" style={{ position: "absolute", right: "20px", bottom: "20px" }}>
                    <Button
                        width={50}
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        style={{ margin: "2px" }}
                        onClick={onPopHiding}
                    >
                        닫기
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div>
                <Popup
                    width="70%"
                    height="50%"
                    visible={visible}
                    onHiding={onPopHiding}
                    showCloseButton={true}
                    contentRender={renderDocHist}
                    title={"문서이력"}
                />
            </div>
        </>
    )
}
export default ElecAtrzHistPopup;