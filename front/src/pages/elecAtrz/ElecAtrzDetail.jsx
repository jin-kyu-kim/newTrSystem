import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import ElecAtrzTitleInfo from './common/ElecAtrzTitleInfo';
import CustomTable from 'components/unit/CustomTable';
import ElecAtrzTabDetail from './ElecAtrzTabDetail';
import electAtrzJson from './ElecAtrzJson.json';
import ApiRequest from 'utils/ApiRequest';
import './ElecAtrz.css'
import { useCookies } from 'react-cookie';
import { max } from 'date-fns';

const ElecAtrzDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const detailData = location.state.data;
    const [ prjctData, setPrjctData ] = useState({});
    const [ atrzOpnn, setAtrzOpnn ] = useState([]);
    const { header, keyColumn, columns, queryId } = electAtrzJson.electAtrzDetail;
    const [ cookies ] = useCookies(["userInfo"]);
    const [maxAtrzLnSn, setMaxAtrzLnSn] = useState();

    const onBtnClick = (e) => {

        switch (e.element.id) {
            case "aprv": ; aprvAtrz();
                break;
            case "rjct": ; rjctAtrz();
                break;
            case "print": console.log("출력 클릭"); 
                break;
            case "docHist": console.log("문서이력 클릭");
                break;
            default:
                break;
        }
    }

    console.log('detailData', detailData);

    useEffect(() => {
        getPrjct();
        getAtrzLn();
        getRefEmp();
        getMaxAtrzLnSn();
    }, []);

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
            elctrnAtrzId: detailData.elctrnAtrzId
        }
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setAtrzOpnn(response);
        } catch (error) {
            console.error(error)
        }
    };

    const getRefEmp = async () => {
        try{
            const response = await ApiRequest('/boot/common/commonSelect', [
                {tbNm: "REFRN_MAN"}, {elctrnAtrzId: detailData.elctrnAtrzId}
            ]);
            console.log('getRef', response);
        } catch(error) {
            console.log('error', error);
        }
    }

    /**
     * 최종 결재선 순번확인: 현재 결재자가 마지막 결재인지 확인하기 위함
     */
    const getMaxAtrzLnSn = async () => {
        const param = {
            queryId: "elecAtrzMapper.retrieveMaxAtrzLnSn",
            elctrnAtrzId: detailData.elctrnAtrzId
        }

        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setMaxAtrzLnSn(response[0].maxAtrzLnSn);

        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 날짜 생성
     * @returns yyyyMMdd
     */
    const getToday = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
    
        return year + month + day;
    }
    

    /**
     * 승인 처리
     */
    const aprvAtrz = async () => {
        const isconfirm = window.confirm("요청을 승인하시겠습니까?");
        const date = getToday();
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

        const nowAtrzLnSn = detailData.nowAtrzLnSn;
        if(isconfirm) {

            const param = [
                { tbNm: "ATRZ_LN" },
                { 
                    atrzSttsCd: "VTW00802",
                    aprvYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: cookies.userInfo.empId,
                },
                { 
                    elctrnAtrzId: detailData.elctrnAtrzId,
                    aprvrEmpId: cookies.userInfo.empId,
                    atrzLnSn: nowAtrzLnSn
                }
            ]

            const result = await ApiRequest("/boot/common/commonUpdate", param);

            if(result > 0) {
                // 단계 올리기
                upNowAtrzLnSn(nowAtrzLnSn);
            } else {
                alert("승인 처리에 실패하였습니다.");
                return;
            }
        }
    }

    /**
     * 결재가 완료된 후 결재선 순번에 따라 현재 결재선 순번을 높여준다. 
     * @param {} nowAtrzLnSn : 현재 결재선 순번
     * @returns 
     */
    const upNowAtrzLnSn = async (nowAtrzLnSn) => {

        let updParam = {};
        console.log("maxAtrzLnSn", maxAtrzLnSn)
        console.log("nowAtrzLnSn", nowAtrzLnSn)

        if(nowAtrzLnSn === maxAtrzLnSn) {
            // max와 현재가 같으면 최종승인임.
            updParam = {
                atrzDmndSttsCd: "VTW00802",
                nowAtrzLnSn: nowAtrzLnSn,
                mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
                mdfcnEmpId: cookies.userInfo.empId
            }
        } else {
            // max와 현재가 다르면 중간승인임.
            updParam = {
                nowAtrzLnSn: nowAtrzLnSn + 1,
                mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
                mdfcnEmpId: cookies.userInfo.empId
            }
        }

        const param = [
            { tbNm: "ELCTRN_ATRZ" },
            updParam,
            {
                elctrnAtrzId: detailData.elctrnAtrzId
            }
        ]
    
        try {
            const response = await ApiRequest("/boot/common/commonUpdate", param);
            if(response > 0) {
                alert("승인 처리되었습니다.");
                navigate('/elecAtrz/ElecAtrz');
            } else {
                alert("승인 처리에 실패하였습니다.");
                return;
            }
        } catch (error) {
            console.error(error)
        }
    }

    const rjctAtrz = async () => {
        const isconfirm = window.confirm("요청을 반려하시겠습니까?");
        const date = getToday();
        const mdfcnDt = new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0];

        const nowAtrzLnSn = detailData.nowAtrzLnSn;
        if(isconfirm) {

            const param = [
                { tbNm: "ATRZ_LN" },
                { 
                    atrzSttsCd: "VTW00803",
                    rjctYmd: date,
                    mdfcnDt: mdfcnDt,
                    mdfcnEmpId: cookies.userInfo.empId,
                },
                { 
                    elctrnAtrzId: detailData.elctrnAtrzId,
                    aprvrEmpId: cookies.userInfo.empId,
                    atrzLnSn: nowAtrzLnSn
                }
            ]

            const result = await ApiRequest("/boot/common/commonUpdate", param);

            if(result > 0) {
                alert("반려 처리되었습니다.");
                navigate('/elecAtrz/ElecAtrz');
            } else {
                alert("반려 처리에 실패하였습니다.");
            }
        }
    }

    /**
     * 휴가결재 최종 승인 시 휴가 일수 차감 
     */
    const handleVacation = async () => {

        // USE_DAYCNT
        // PBLEN_VCATN_USE_DAYCNT
        // VCATN_REMNDR_DAYCNT

        if(detailData.elctrnAtrzTySeCd === "VTW04901") {

            let updParam = {}
            const dtlInfo = {};
            // if(["VTW01204", "VTW01205", "VTW01206"].includes(dtlInfo.vcatnTyCd)) {
            //     updParam = {
            //         pblenVcatnUseDaycnt: dtlInfo.vcatnDeCnt,
            //         mdfcnDt: new Date().toISOString().split('T')[0]+' '+new Date().toTimeString().split(' ')[0],
            //         mdfcnEmpId: cookies.userInfo.empId   
            //     }
            // } else if (["VTW01201", "VTW01202", "VTW01203"].includes(dtlInfo.vcatnTyCd)){
            //     updParam = {
            //         useDaycnt: 
            //     }
            // }
            

            // constParam = [
            //     { tbNm: "VCATN_MNG" },
            //     {  },
            // ]
        }
        

    }

    return (
        <div className="container" style={{ marginTop: "10px" }}>
            {atrzOpnn.length !== 0 && 
                <ElecAtrzTitleInfo
                    atrzLnEmpList={atrzOpnn}
                    contents={header}
                    formData={detailData}
                    prjctData={prjctData}
                    atrzParam={detailData}
                    onClick={onBtnClick}
                />}

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