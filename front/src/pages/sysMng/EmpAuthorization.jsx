import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SelectBox from 'devextreme-react/select-box';
import { Button } from "devextreme-react";
import List from 'devextreme-react/list';
import SearchInfoSet from "components/composite/SearchInfoSet";
import CustomEditTable from 'components/unit/CustomEditTable';
import empListJson from "../infoInq/EmpListJson.json";
import sysMngJson from "./SysMngJson.json";
import ApiRequest from "utils/ApiRequest";
import moment from 'moment';
import './sysMng.css'

const EmpAuthorization = () => {
    const { queryId, columns } = sysMngJson.empAuthJson;
    const { keyColumn, searchInfo } = empListJson;
    const [ param, setParam ] = useState({});
    const [ empList, setEmpList ] = useState([]);
    const [ createAuthList, setCreateAuthList ] = useState([]);
    const [ basicAuthList, setBasicAuthList ] = useState([]);
    const [ selectedList, setSelectedList ] = useState([]);
    const [ selectedAuthId, setSelectedAuthId ] = useState('');
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const sessionId = cookies.userInfo.empId;
    const date = moment();

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
          getEmpList();
        }
        getCreateAuth();
    }, [param]);

    const searchHandle = async (initParam) => {
        setParam({
            ...initParam,
            queryId: queryId
        });
    };

    const getEmpList = async () => {
        try {
            const response = await ApiRequest('/boot/common/queryIdSearch', param);
            if(response.length !== 0) setEmpList(response);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getCreateAuth = async () => {
        try {
            const response = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "AUTHRT_GROUP" }
            ]);
            setCreateAuthList(response);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getCodeList = async (e) => {
        try{
            const response = await ApiRequest('/boot/common/commonSelect', [
                {tbNm: "AUTHRT_MAPNG"}, {authrtGroupId: e.itemData.authrtGroupId}
            ]);
            const auth = response.map(item => ({
                cdNm: item.authrtCdNm,
                authrtGroupId: item.authrtGroupNm
            }));
            setBasicAuthList(auth);
            setSelectedAuthId(e.itemData.authrtGroupId);
        } catch(error){
            console.log('error', error);
        }
    }
    const onSelection = (e) => { setSelectedList(e.selectedRowsData) }

    const addEmp = async() => {
        const params = selectedList.map(emp => ([{tbNm: "LGN_USER_AUTHRT"},
        {
            empId: emp.empId,
            authrtGroupId: selectedAuthId,
            regEmpId: sessionId,
            regDt: date.format('YYYY-MM-DD HH:mm:ss')
        }]));
        try {
            let response;
            for(let i=0; i<params.length; i++){
                response = await ApiRequest('/boot/common/commonInsert', params[i]);
            }
            if(response >= 1) alert('저장되었습니다.')
        } catch (error) {
            console.log('API 요청 에러', error);
        }
    }

    const authRender = (e) => {
        return(
            <div className='selectBoxRender'>
                <div style={{ width: '40%', borderRight: '4px solid #ccc' }}>{e.authrtGroupNm}</div>
                <div style={{ width: '60%', marginLeft: '20px'}}>{e.authrtGroupCn}</div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="title p-1" style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "40px" }}>권한부여 관리</h1>
                <span>*사용자 권한을 관리합니다.</span>
            </div>
            <div style={{ marginBottom: "30px" }}>
                <SearchInfoSet props={searchInfo} callBack={searchHandle} />
            </div>

            <div style={{ display: "flex", marginBottom: "100px" }}>
                <div style={{ flex: 1, border: "1px solid #ccc", height: '1100px' }}>
                    <CustomEditTable
                        keyColumn={keyColumn}
                        values={empList}
                        columns={columns}
                        noEdit={true}
                        onSelection={onSelection}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button icon="arrowright" stylingMode="text" className="arrowIcon" />
                </div>
                <div style={{ flex: 1, border: "1px solid #ccc", height: '1100px' }}>
                    <SelectBox
                        dataSource={createAuthList}
                        displayExpr='authrtGroupNm'
                        placeholder='권한을 선택해주세요'
                        showClearButton={true}
                        itemRender={authRender}
                        onItemClick={getCodeList}
                        height={60}
                    />
                    {basicAuthList.length !== 0 &&
                    <div className='authNmArea'>
                        <h5 className='authTitle'>* 포함된 권한 목록</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '50px'}}>
                            {basicAuthList.map((auth, index) => (
                            <div key={index} className="authNameItem" >{auth.cdNm}</div>
                            ))}
                        </div><hr/>

                        <span>- 해당 권한을 부여할 직원을 선택해주세요.</span>
                        {selectedList.length !== 0 && 
                        <div style={{marginTop: '20px'}}>
                            <List
                                displayExpr='empFlnm'
                                dataSource={selectedList}
                                allowItemDeleting={true}
                                itemDeleteMode='toggle'
                                itemRender={(e) => (
                                    <div>
                                        <span style={{marginRight: '30px'}}>{e.empFlnm}</span>
                                        <span style={{marginRight: '30px'}}>{e.jbpsNm}</span>
                                        <span style={{marginRight: '30px'}}>{e.deptId}</span>
                                    </div>
                                )}
                            />
                            <div style={{textAlign: 'right'}}>
                                <Button text='등록' type='default' onClick={addEmp}/>
                            </div>
                        </div> }
                    </div>}
                </div>
            </div>
        </div>
    );
};
export default EmpAuthorization;