import React, {useCallback, useEffect, useState} from "react";
import { Popup, TabPanel } from "devextreme-react";
import { useCookies } from "react-cookie";
import EmpInfoJson from "./EmpInfoJson.json";
import Button from "devextreme-react/button";
import { useLocation, useNavigate } from 'react-router-dom';
import EmpInfoPop from "./EmpInfoPop";

const EmpDetailInfo = () => {
    
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const EmpDetailInfo = EmpInfoJson.EmpDetailInfo;

    const navigate = useNavigate();
    const location = useLocation();
    const [naviEmpId, setNaviEmpId] = useState([]);
    const [showNewButton, setShowNewButton] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    useEffect(() => {

        if (location.state !== null){
            setNaviEmpId(location.state.empId);
            const naviTapIndex = location.state.index;

            setSelectedIndex(naviTapIndex);
            setShowNewButton(true);
        }
    },[]);

    /*유저세션*/
    const [cookies, setCookie] = useCookies(["userInfo", "userAuth"]);
    
     const empId = cookies.userInfo.empId;
     const deptId = cookies.userInfo.deptId;
   
    //탭 변경시 인덱스 설정 
    const onSelectionChanged = useCallback(
        (args) => {
          if (args.name === "selectedIndex") {
            setSelectedIndex(args.value);

              if (location.state !== null && args.value == 0 && empId !== naviEmpId){
                  setSelectedIndex(args.previousValue);
              }
          }
        },
        []
      );



    const itemTitleRender = (a) => <span>{a.TabName}</span>;
    
    const onClick = () => {
        navigate("/humanResourceMng/EmpManage");
    };

    const openInfoPopup = () => {
      setIsPopupVisible(true); // 팝업 열기
      // window.open("../pages/infoInq/EmpInfoPop", "_blank", "width=700,height=600");
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };


    return (
        <div>
        <div
          className="title p-1"
          style={{ marginTop: "20px", marginBottom: "10px" }}
        >
          <div style={{ marginRight: "20px", marginLeft: "20px" }}>
            <h1 style={{ fontSize: "30px" }}>개인정보관리</h1>
          </div>
        </div>
        <div className="buttons" align="right" style={{ margin: "20px" }}>
        <Popup
          title="직원정보 출력"
          visible={isPopupVisible}
          onHiding={closePopup}
          width={700}
          height={600}
        > 
          <Button text="닫기" onClick={closePopup} />
        {isPopupVisible && (
          <EmpInfoPop  closePopup={closePopup} />
        )}
  {/* 선택한 그룹의 정보 출력 */}
</Popup>

          
          
          <Button
            width={130}
            text="Contained"
            type="default"
            stylingMode="contained"
            style={{ margin: "2px" }}
            onClick={openInfoPopup}
          >
            전체이력조회출력
          </Button>

            {showNewButton && (
                <Button
                    width={110}
                    text="New Button"
                    type="default"
                    stylingMode="contained"
                    style={{ margin: "2px" }}
                    onClick={onClick}
                >
                    목록
                </Button>
            )}
        </div>
        <div
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            width: "100%",
            height: "100%",
          }}
        >
          <TabPanel
            height="auto"
            width="auto"
            dataSource={EmpDetailInfo}
            selectedIndex={selectedIndex}
            onOptionChanged={onSelectionChanged}
            itemTitleRender={itemTitleRender}
            animationEnabled={true}
            itemComponent={({ data }) => {
            const Component = React.lazy(() => import(`${data.url}`));
            if(data.index=== selectedIndex){
              return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Component naviEmpId={naviEmpId}/>
                </React.Suspense>
            );
            }
            
          }}
          />
        </div>
      </div>
      
    );
};

export default EmpDetailInfo;