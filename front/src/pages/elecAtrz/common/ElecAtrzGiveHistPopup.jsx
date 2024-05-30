import React, { useState, useEffect } from "react";
import { Popup } from "devextreme-react";
import { Button } from "devextreme-react";
import CustomTable from "components/unit/CustomTable";
import ApiRequest from "utils/ApiRequest";
import ElecAtrzGiveHistPopupJson from "./ElecAtrzGiveHistPopupJson.json";
import { useNavigate } from 'react-router-dom';

const ElecAtrzGiveHistPopup = ({ visible, onPopHiding, selectedData }) => {

    const { queryId, keyColumn, columns } = ElecAtrzGiveHistPopupJson;
    const [ values, setValues ] = useState([]);
    const navigate = useNavigate ();

    useEffect(() => {
        retrieveAtrzGiveHist();
    }, [selectedData]);

    const retrieveAtrzGiveHist = async () => {

        const param = {
            queryId: queryId,
            elctrnAtrzId: selectedData.elctrnAtrzId
        }

        const response = await ApiRequest("/boot/common/queryIdSearch", param); 
        setValues(response);
    }

    const onClickBtn = async (e, value) => {

        const param = {
            queryId: "elecAtrzMapper.retrieveAtrzHist",
            empId: value.atrzDmndEmpId,
            sttsCd: "VTW03703",
            elctrnAtrzId : value.elctrnAtrzId
        }

        let detailData = await ApiRequest("/boot/common/queryIdSearch", param);

        // const data = "data"
        // const sttsCd = "sttsCd"
        // const prjctId = "prjctId"

        // localStorage.setItem(data, JSON.stringify(detailData[0]));
        // localStorage.setItem(sttsCd, JSON.stringify(detailData[0].atrzDmndSttsCd));
        // localStorage.setItem(prjctId, JSON.stringify(detailData[0].prjctId));

        // const url = new URL(window.location.origin + "/elecAtrz/ElecAtrzDetail");
        // window.open(url.toString(), "_blank");
        
        navigate('/elecAtrz/ElecAtrzDetail', { state: { data: detailData[0], sttsCd: detailData[0].atrzDmndSttsCd, prjctId:detailData[0].prjctId, refer: null, docSeCd: "VTW03405", give: true}})

        onPopHiding();
        
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
export default ElecAtrzGiveHistPopup;