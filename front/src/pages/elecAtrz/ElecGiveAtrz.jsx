import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzJson from '../elecAtrz/ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css';
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
    const formData = location.state.formData;

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
    
    const ElecGiveBox = ({title, keyNm, typeCd}) => {
        return (
            <div style={(clickBox === keyNm) ?  { backgroundColor: '#4473a5', color: 'white' } : { backgroundColor: 'lightblue' }} 
                className='elec-square' onClick={() => getList(keyNm, typeCd)} >
                <div>{title}</div>
                <div>{countList[typeCd] ? countList[typeCd] : 0} 건</div>
            </div>
        );
    };

    const onClickBtn = (btn, data) => {

        // formData.ctrtElctrnAtrzId = data.elctrnAtrzId;

        if(btn.name === 'moveReq'){
            navigate('/elecAtrz/ElecAtrzNewReq', {state: {
                prjctId: prjctId,
                formData: formData,
                sttsCd: formData.docSeCd,
                ctrtTyCd: data.elctrnAtrzTySeCd
            }})
        }
    }

    return (
        <div className="container">
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

                {selectedList.length !== 0 && 
                <CustomTable
                    keyColumn={keyColumn}
                    values={selectedList}
                    columns={tableColumns}
                    wordWrap={true}
                    onClick={onClickBtn}
                    onRowDblClick={(e) => navigate('/elecAtrz/ElecAtrzDetail', {
                        state: {data: e.data, prjctId: prjctId, sttsCd: e.data.atrzDmndSttsCd, docSeCd:formData.docSeCd, formData: formData}
                    })}
                />}
            </div>
        </div>
    );
}
export default ElecGiveAtrz;