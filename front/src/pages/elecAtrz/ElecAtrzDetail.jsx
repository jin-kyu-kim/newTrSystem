import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import ElecAtrzHeader from './common/ElecAtrzHeader';
import ElecAtrzTitleInfo from './common/ElecAtrzTitleInfo';
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzTabDetail from './ElecAtrzTabDetail';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css'

const ElecAtrzDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const detailData = location.state.data;
    const [ prjctData, setPrjctData ] = useState({});
    const [ atrzOpnn, setAtrzOpnn ] = useState({});
    const { header, keyColumn, columns, queryId } = electAtrzJson.electAtrzDetail;

    const onBtnClick = (e) => {
    }

    useEffect(() => {
        getPrjct();
        getAtrzLn();
    }, []);

    console.log(typeof detailData.nowAtrzLnSn)
    const getPrjct = async () => {
        try {
            const response = await ApiRequest("/boot/common/commonSelect", [
                { tbNm: "PRJCT" }, { prjctId: detailData.prjctId }
            ]);
            setPrjctData(response[0]);
        } catch (error) {
            console.error(error)
        }
    };

    const getAtrzLn = async () => {
        const param = {
            queryId: queryId,
            elctrnAtrzId: detailData.elctrnAtrzId,
            atrzLnSn: detailData.nowAtrzLnSn
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setAtrzOpnn(response);
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className="container" style={{ marginTop: "10px" }}>
            <ElecAtrzHeader
                contents={header}
                onClick={onBtnClick}
            />
            <ElecAtrzTitleInfo
                formData={detailData}
                prjctData={prjctData}
                atrzParam={detailData}
            />

            {/* 휴가, 청구의 경우에는 컴포넌트 렌더링 */}
            {(['VTW04901', 'VTW04907'].includes(detailData.elctrnAtrzTySeCd)) && (
                <ElecAtrzTabDetail
                    detailData={detailData}
                />
            )}

            <div dangerouslySetInnerHTML={{ __html: detailData.cn }} />

            <hr className='elecDtlLine' style={{marginTop: '100px'}}/>
            <span>* 첨부파일</span>

            <hr className='elecDtlLine'/>
            <span style={{marginLeft: '8px'}}>결재 의견</span>
            <CustomTable
                keyColumn={keyColumn}
                columns={columns}
                values={atrzOpnn}
            />

            <div style={{textAlign: 'center', marginBottom: '100px'}}>
                <Button text='목록' type='normal' onClick={() => navigate('/elecAtrz/ElecAtrz')} />
            </div>
        </div>
    );
}
export default ElecAtrzDetail;