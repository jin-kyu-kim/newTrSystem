import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from 'react-cookie';
import { Button } from "devextreme-react";
import { TabPanel } from "devextreme-react/tab-panel";
import Form, { Label, RequiredRule, SimpleItem } from "devextreme-react/form";
import List from "devextreme-react/list";
import sysMngJson from "./SysMngJson.json";
import ApiRequest from 'utils/ApiRequest';
import uuid from "react-uuid";
import moment from 'moment';
import "./sysMng.css";

const EmpAuth = () => {
    const itemTitle = (tab) => <span>{tab.tabName}</span>;
    const { tabMenu, authQueryId, formColumn } = sysMngJson.empAuthJson;
    const [cookies] = useCookies(["userInfo", "userAuth"]);
    const empId = cookies.userInfo.empId;
    const date = moment();
    const initData = {authrtGroupId: uuid(), regDt: date.format('YYYY-MM-DD HH:mm:ss'), regEmpId: empId}
    const [authList, setAuthList] = useState([]);
    const [newAuthList, setNewAuthList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [groupId, setGroupId] = useState('');
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
            const response = await ApiRequest('/boot/common/queryIdSearch', {queryId: authQueryId});
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
        setGroupId(e.itemData.authrtGroupId);
        setSelectedItems([]);
        setData({
            authrtGroupNm: e.itemData.authrtGroupNm,
            authrtGroupCn: e.itemData.authrtGroupCn
        });
        setSelectedItems(e.itemData.authrtCds.split(",").map((authrtCd, index) => ({
            authrtCd: authrtCd, 
            authrtCdNm: e.itemData.authrtCdNms.split(",")[index]
        })));
    };
    
    const newAuthStore = async (editMode) => {
        if (formRef.current.instance.validate().isValid) {
            const cdParam = [{ tbNm: "AUTHRT_MAPNG" }].concat(
                selectedItems.map((item) => ({
                    authrtGroupId: editMode === 'insert' ? data.authrtGroupId : groupId, 
                    authrtCd: item.authrtCd,
                    regDt: data.regDt,
                    regEmpId: data.regEmpId
                }))
            );
            const storeData = editMode === 'insert' ? [{ tbNm: "AUTHRT_GROUP" }, data]
                        : [{ tbNm: "AUTHRT_GROUP" }, data, {authrtGroupId: groupId}];

            const params = { dataParam: storeData, cdParam: cdParam }
            try {
                const response = await ApiRequest('/boot/sysMng/insertAuth', params);
                if(response >= 1) {
                    alert(editMode === 'insert' ? '등록되었습니다.' : '수정되었습니다.')
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
    useEffect(() => {
        if(selectedItems.length === 0) clickCancelBtn();
    }, [selectedItems.length])

    const clickCancelBtn = () => {
        setSelectedItems([]);
        setData(initData);
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
                <div className="authIcon">
                    <Button icon="arrowright" stylingMode="text" className="arrowIcon" />
                </div>
                <div className="authRightArea">
                    <div style={{ display: 'flex' }}>
                        {selectedItems.length !== 0 && selectedItems[0].authrtGroupId ? 
                        <h5 className="authRightTtl">생성 권한 수정</h5>
                        :<><h5 className="authRightTtl">
                            선택권한 목록
                        </h5><span>(좌측 영역에서 추가할 권한을 선택해주세요.)</span></>}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        {selectedItems.length > 0 && (
                            <div className="authCdArea">
                                {selectedItems.map((item) => (
                                    <div key={item.authrtCd} className="authCd">
                                        <span>{item.authrtCdNm}</span>
                                        <Button icon="close" className="icon-button" stylingMode="text"
                                            onClick={() => handleRemoveItem(item.authrtCd)} />
                                    </div>
                                ))}
                            </div>                                                                                                                                                                                         
                        )}
                    </div>

                    <Form formData={data} ref={formRef}>
                        {formColumn.map((col, index) => (
                            <SimpleItem key={index} dataField={col.dataField} editorType={col.editorType}><Label text={col.caption}/>
                                <RequiredRule message={col.message} />
                            </SimpleItem> ))}
                    </Form>
                    <div style={{ textAlign: "right", marginTop: "20px" }}>
                        {selectedItems.length !== 0 ? (data.authrtGroupNm ? 
                        <><Button text="수정" type='default' onClick={() => newAuthStore('update')} style={{marginRight: '5px'}}/><Button text='취소' onClick={clickCancelBtn}/></> : 
                        <><Button text="등록" type='success' onClick={() => newAuthStore('insert')} style={{marginRight: '5px'}}/><Button text='취소' onClick={clickCancelBtn}/></>)
                        : ''} 
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EmpAuth;