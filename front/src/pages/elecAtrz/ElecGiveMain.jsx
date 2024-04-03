import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ApiRequest from 'utils/ApiRequest';

const ElecGiveMain = () => {
    const location = useLocation();
    const prjctId = location.state.prjctId;
    const formData = location.state.formData;
    const [prjctData, setPrjctData] = useState({});

    useEffect(() => {
        const getPrjct = async () => {
            const param = [ { tbNm: "PRJCT" }, { prjctId: prjctId} ];
            try {
                const response = await ApiRequest("/boot/common/commonSelect", param);
                setPrjctData(response[0]);
            } catch (error) {
                console.error(error)
            }
        };
        getPrjct();
    }, []);
    
    const ElecGiveBox = ({}) => {
        return (
          <div>
          </div>
        );
      };

    return (
        <div className="container">
            <div className="col-md-10 mx-auto" style={{marginTop: '30px'}}>
                <h2 style={{ marginRight: '50px' }}>{formData.gnrlAtrzTtl}</h2>
                <span>프로젝트: {prjctData.prjctNm}</span>
            </div>

            <div>
                <ElecGiveBox
                
                />
            </div>
        </div>
    );
}
export default ElecGiveMain;