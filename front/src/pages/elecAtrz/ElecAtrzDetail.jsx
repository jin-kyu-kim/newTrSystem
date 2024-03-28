import electAtrzJson from './ElecAtrzJson.json';
import { useLocation } from 'react-router';

const ElecAtrzDetail = () => {
    const location = useLocation();
    const detailData = location.state.data;
    const { electAtrzDetail } = electAtrzJson;

    return (
        <div className="container" style={{ marginTop: "10px" }}>

        </div>
    );
}
export default ElecAtrzDetail;