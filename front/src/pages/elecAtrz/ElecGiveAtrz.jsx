import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzJson from '../elecAtrz/ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css';
import ElecAtrzGiveHistPopup from "./common/ElecAtrzGiveHistPopup";
import { Button } from 'devextreme-react/button';

const ElecGiveAtrz = () => {
    const [ selectedList, setSelectedList ] = useState([]);
    const [ prjctData, setPrjctData ] = useState({});
    const [ countList, setCountList ] = useState({});
    const [ clickBox, setClickBox ] = useState(null);

    const { keyColumn, tableColumns, giveBox } = ElecAtrzJson.elecGiveAtrz;
    const navigate = useNavigate();
    const location = useLocation();
    const prjctId = location.state.prjctId;
    let formData = location.state.formData;

    /**
     * 이력 팝업 관련
     */
    const [ histPopVisible, setHistPopVisible ] = useState(false);
    const [ selectedData, setSelectedData ] = useState([]);

    useEffect(() => {
        getPrjct();
        getAllCnt();
    }, []);

    const getPrjct = async () => {
        const param = [ { tbNm: "PRJCT" }, { prjctId: prjctId} ];
        try {
            const response = await ApiRequest("/boot/common/commonSelect", param);
            setPrjctData(response[0]);
        } catch (error) {
            console.error(error)
        }
    };

    const getAllCnt = async () => {
        try{
            const res = await ApiRequest('/boot/common/queryIdSearch', {
                queryId: "elecAtrzMapper.retrieveCtrtAtrzCnt", prjctId: prjctId
            })
            res.map((one) => {
                setCountList(prevCnt => ({
                    ...prevCnt,
                    [one.ctrtKndCd]: one.ctrtCount
                }))
            })
        } catch(error) {
            console.log('error', error);
        }
    } 

    const getList = (keyNm, typeCd) => {
        setClickBox(keyNm);
        getCtrtAtrzList(typeCd);
    }

    const getCtrtAtrzList = async (typeCd) => {
        try{
            const response = await ApiRequest('/boot/common/queryIdSearch', {
                queryId: "elecAtrzMapper.retrieveCtrtAtrz",
                ctrtKndCd: typeCd,
                prjctId: prjctId
            })
            setSelectedList(response);
        } catch(error) {
            console.log('error', error);
        }
    }

    const getGiveAtrzForms = async (data) => {
        const param = [
            { tbNm: "ELCTRN_ATRZ_DOC_FORM"},
            {
                elctrnAtrzTySeCd: "VTW04911",
                giveDocSeCd: data.ctrtKndCd
            }
        ]

        let response
        try {

            response = await ApiRequest("/boot/common/commonSelect", param);
            
        } catch (error) {
            
        }
        formData = response[0]
        formData.ctrtElctrnAtrzId = data.elctrnAtrzId;

        navigate('/elecAtrz/ElecAtrzNewReq', {state: {
            prjctId: prjctId,
            formData: formData,
            sttsCd: "VTW03405",
            ctrtTyCd: data.elctrnAtrzTySeCd,
            prjctData : prjctData
        }})
    }
    
    const ElecGiveBox = ({title, keyNm, typeCd}) => {
        return (
            <div style={(clickBox === keyNm) ?  { backgroundColor: '#4473a5', color: 'white' } : { backgroundColor: 'lightblue' }} 
                className='elec-square' onClick={() => getList(keyNm, typeCd)} >
                <div>{title}</div>
                <div>{countList[typeCd] ? countList[typeCd] : 0} 건</div>
            </div>
        );
    };

    const onClickBtn = async (btn, data) => {

        if(btn.name === "hist") {

            console.log(data);
            await onSetPopData(data);
            await onHistPopAppear();

        }

        if(btn.name === 'moveReq'){
            getGiveAtrzForms(data);
        }
    }

    const toGiveReq = (e) => {
        if(e.event.target.className === "dx-button-content" || e.event.target.className === "dx-button-text") {
            return;
        } else {
            navigate('/elecAtrz/ElecAtrzDetail', {
                state: {data: e.data, prjctId: prjctId, sttsCd: e.data.atrzDmndSttsCd, docSeCd:formData.docSeCd, formData: formData}
            })
        }
    }

    const onHistPopHiding = async () => {
        setHistPopVisible(false);
    }

    const onHistPopAppear = async () => {
        setHistPopVisible(true);
    }

    const onSetPopData = async (data) => {
        setSelectedData(data);
    }

    return (
        <div className="">
            <div className="col-md-10 mx-auto" style={{marginTop: '30px'}}>
                <div className="buttons" align="right" style={{ margin: "20px" }}>
                    <Button text="목록" style={{}} onClick={(e)=>{navigate('/elecAtrz/ElecAtrzForm', {state : {prjctId: prjctId}})}}/>
                </div>
                <h2 style={{ marginRight: '50px' }}>{formData.gnrlAtrzTtl}</h2>
                <span>프로젝트: {prjctData.prjctNm}</span>
            
                <div style={{display: 'flex', marginTop: '20px', marginBottom: '20px'}}>
                    {giveBox.map((box, index) => (
                        <ElecGiveBox key={index} title={box.title} keyNm={box.key} typeCd={box.ctrtKndCd} />
                    ))}
                </div>

                <div className="elecGiveAtrzTable">
                    {selectedList.length !== 0 && 
                    <CustomTable
                    keyColumn={keyColumn}
                        values={selectedList}
                        columns={tableColumns}
                        wordWrap={true}
                        onClick={onClickBtn}
                        onRowClick={(e) => toGiveReq(e)}
                    />}
                    <ElecAtrzGiveHistPopup
                        visible={histPopVisible}
                        onPopHiding={onHistPopHiding}
                        selectedData={selectedData}
                    />
                </div>
            </div>
        </div>
    );
}
export default ElecGiveAtrz;