import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from 'react-cookie';
import { Button } from "devextreme-react";
import List from "devextreme-react/list";
import { TabPanel } from "devextreme-react/tab-panel";
import Form, { Label, RequiredRule, SimpleItem } from "devextreme-react/form";
import sysMngJson from "./SysMngJson.json";
import ApiRequest from 'utils/ApiRequest';
import uuid from "react-uuid";
import moment from 'moment';
import "./sysMng.css";

const EmpAuth = () => {
    const { tabMenu, formColumn } = sysMngJson.empAuthJson;
    const itemTitle = (tab) => <span>{tab.tabName}</span>;
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const empId = cookies.userInfo.empId;
    const date = moment();
    const initData = {authrtGroupId: uuid(), regDt: date.format('YYYY-MM-DD HH:mm:ss'), regEmpId: empId}
    const [authList, setAuthList] = useState([]);
    const [newAuthList, setNewAuthList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [data, setData] = useState(initData);
    const formRef = useRef(null);

    const onSelectionChanged = useCallback(
        (args) => {
            if (args.name === "selectedIndex") setSelectedIndex(args.value);
        }, [setSelectedIndex]
    );

    useEffect(() => {
        getAuthCd();
        getCreateList();
        console.log(cookies);
    }, []);

    const getAuthCd = async () => {
        const param =  [ { tbNm: "CD" }, { upCdValue: "VTW048" } ];
        try {
            const response = await ApiRequest('/boot/common/commonSelect', param);
            if (response.length !== 0) setAuthList(response);
        } catch (error) {
            console.log('error', error);
        }
    };

    const getCreateList = async () => {
        try {
            const response = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "AUTHRT_GROUP" }, {regEmpId: '20221064-bf25-11ee-b259-000c2956283f'}
            ]);
            if (response.length !== 0) setNewAuthList(response);
        } catch (error) {
            console.log('error', error);
        }
    };

    const onItemClick = (e) => {
        const newItem = e.itemData;
        if (!selectedItems.some((item) => item.authrtCd === newItem.cdValue)) {
            setSelectedItems([...selectedItems, {authrtCd: newItem.cdValue, authrtCdNm: newItem.cdNm }]);
        } else alert('이미 선택된 권한입니다')
    };

    const newAuthClick = async (e) => {
        setSelectedItems([]);
        setData({
            authrtGroupNm: e.itemData.authrtGroupNm,
            authrtGroupCn: e.itemData.authrtGroupCn
        });
        try{
            const res = await ApiRequest('/boot/common/commonSelect', [
                { tbNm: "AUTHRT_MAPNG" }, { authrtGroupId: e.itemData.authrtGroupId }
            ]);
            setSelectedItems(res)
        } catch (error) {
            console.error("API 요청 에러", error);
        }
    };

    const newAuthStore = async () => {
        if (formRef.current.instance.validate().isValid) {
            const cdParam = [{ tbNm: "AUTHRT_MAPNG" }].concat(
                selectedItems.map((item) => ({
                    authrtGroupId: data.authrtGroupId, 
                    authrtCd: item.authrtCd,
                    regDt: data.regDt,
                    regEmpId: data.regEmpId
                }))
            );
            const params = { dataParam: [{ tbNm: "AUTHRT_GROUP" }, data], cdParam: cdParam }
            try {
                const response = await ApiRequest('/boot/sysMng/insertAuth', params);
                if(response >= 1) {
                    alert('등록되었습니다.')
                    getCreateList();
                    setData(initData);
                    setSelectedItems([]);
                    setSelectedIndex(1);
                }
            } catch(error) {
                console.log('error', error);
            }
        } else{
            alert('필수 항목을 입력해주세요')
        }
    };
 
    const deleteNewAuth = async (e) => {
        const result = window.confirm("삭제하시겠습니까?");
        if (result) {
            try{
                const response = await ApiRequest('/boot/sysMng/deleteAuth', {
                    groupTb: [{tbNm: "AUTHRT_GROUP"}, {authrtGroupId: e.itemData.authrtGroupId}],
                    mapngTb: [{tbNm: "AUTHRT_MAPNG"}, {authrtGroupId: e.itemData.authrtGroupId}]
                });
                if(response >= 1) alert('권한이 삭제되었습니다')
            } catch(error) {
                console.log(error)
            }
        } else e.cancel = true;
    };

    const handleRemoveItem = (authrtCd) => {
        setSelectedItems(selectedItems.filter((item) => item.authrtCd !== authrtCd));
    };
    const clickCancelBtn = () => {
        setSelectedItems([])
        if (formRef.current) formRef.current.instance.reset();
    }

    return (
        <div className="container">
            <div className="title p-1"  style={{ marginTop: "20px", marginBottom: "10px" }} ></div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "40px" }}>접근권한 관리</h1>
                <span>* 새로운 권한을 생성합니다.</span>
            </div>

            <div style={{ display: "flex", marginBottom: "100px" }}>
                <div style={{ flex: 1 }}>
                    <TabPanel
                        height={660}
                        dataSource={tabMenu}
                        selectedIndex={selectedIndex}
                        itemTitleRender={itemTitle}
                        onOptionChanged={onSelectionChanged}
                        itemComponent={({ data }) => (
                            <List
                                dataSource={data.default ? authList : newAuthList}
                                displayExpr={data.displayExpr}
                                onItemClick={data.default ? onItemClick : newAuthClick}
                                allowItemDeleting={data.default ? false : true}
                                onItemDeleting={deleteNewAuth} />
                        )} />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button icon="arrowright" stylingMode="text" className="arrowIcon" />
                </div>
                <div style={{ flex: 1, border: "1px solid #ccc", padding: "20px", height: '660px' }}>
                    <div style={{ display: 'flex' }}>
                        {selectedItems.length !== 0 && selectedItems[0].authrtGroupId ? 
                        <h5 style={{ textDecoration: "underline", fontWeight: "bold", marginRight: '10px' }}>생성 권한 수정</h5>
                        :<><h5 style={{ textDecoration: "underline", fontWeight: "bold", marginRight: '10px' }}>
                            선택권한 목록
                        </h5><span>(좌측 영역에서 추가할 권한을 선택해주세요.)</span></>}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        {selectedItems.length > 0 && (
                            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                                {selectedItems.map((item) => (
                                    <div key={item.authrtCd} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.authrtCdNm}</div>
                                        <Button icon="close" className="icon-button" stylingMode="text"
                                            onClick={() => handleRemoveItem(item.authrtCd)} />
                                    </div>
                                ))}
                            </div>                                                                                                                                                                                         
                        )}
                    </div>

                    <Form formData={data} ref={formRef}>
                        {formColumn.map((col) => (
                            <SimpleItem dataField={col.dataField} editorType={col.editorType}><Label text={col.caption}/>
                                <RequiredRule message={col.message} />
                            </SimpleItem> ))}
                    </Form>
                    <div style={{ textAlign: "right", marginTop: "20px" }}>
                        {selectedItems.length !== 0 ? (selectedItems[0].authrtGroupId !== undefined ? 
                        <><Button text="수정" type='default' onClick={newAuthStore} style={{marginRight: '5px'}}/><Button text='취소' onClick={clickCancelBtn}/></> : 
                        <><Button text="등록" type='success' onClick={newAuthStore} style={{marginRight: '5px'}}/><Button text='취소' onClick={clickCancelBtn}/></>)
                        : ''} 
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EmpAuth;