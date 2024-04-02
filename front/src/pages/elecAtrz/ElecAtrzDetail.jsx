import electAtrzJson from './ElecAtrzJson.json';
import { useLocation } from 'react-router';
import ElecAtrzHeader from './common/ElecAtrzHeader';
import ElecAtrzTitleInfo from './common/ElecAtrzTitleInfo';
import electDetailJson from './ElecAtrzJson.json'

const ElecAtrzDetail = () => {
    const location = useLocation();
    const detailData = location.state.data;
    const { electAtrzDetail } = electAtrzJson;
    console.log('detailData', detailData)
    const onBtnClick = (e) => {

    }

    return (
        <div className="container" style={{ marginTop: "10px" }}>
            <ElecAtrzHeader
                contents={electDetailJson.header}
                onClick={onBtnClick}
            />
            {/* <ElecAtrzTitleInfo
                formData={detailData}
                prjctData={prjctData}
                onHandleAtrzTitle={handleElecAtrz}
                atrzParam={atrzParam}
            /> */}
        </div>
    );
}
export default ElecAtrzDetail;