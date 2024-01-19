import { useState } from "react";
import DetailAcbg from "./DetailAcbg";
import DetailFgggAblty from "./DetailFgggAblty";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Stack } from "react-bootstrap";
import { FiPrinter } from "react-icons/fi";

const DetailMain = () => {
  const [activeTab, setActiveTab] = useState("비밀번호변경");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Stack gap={3}>
      <div
        className="title p-1"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <h2 style={{ fontSize: "30px" }}>개인정보관리</h2>
      </div>
      <div className="p-1">
        <Button
          variant="success"
          style={{
            background: "linear-gradient(to bottom, #61dd45, #3cb521)",
            border: "1px solid #2e8a19",
            float: "right",
            marginRight: "10px",
          }}
        >
          <FiPrinter />
          전체이력조회
        </Button>
      </div>

      {/* 탭 메뉴 */}
      <ul className="nav nav-tabs">
        <Tab
          tabName=" 비밀번호변경"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
        <Tab
          tabName="학력"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
        <Tab
          tabName="외국어능력"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
        <Tab
          tabName="교육이력"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
        <Tab
          tabName="경력"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
        <Tab
          tabName="프로젝트이력"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
      </ul>

      {/* 탭 내용 */}
      {activeTab === " 비밀번호변경" && (
        <div>
          <h4>비밀번호변경</h4>
          {/* 비밀번호 변경 내용 추가 */}
        </div>
      )}
      {activeTab === "학력" && (
        <div>
          <DetailAcbg />
        </div>
      )}

      {activeTab === "외국어능력" && (
        <div>
          <DetailFgggAblty />
        </div>
      )}
      {activeTab === "교육이력" && (
        <div>
          <h4>교육이력</h4>
          {/* 교육 이력 내용 추가 */}
        </div>
      )}
      {activeTab === "경력" && (
        <div>
          <h4>경력</h4>
          {/* 경력 내용 추가 */}
        </div>
      )}
      {activeTab === "프로젝트이력" && (
        <div>
          <h4>프로젝트이력</h4>
          {/* 프로젝트 이력 내용 추가 */}
        </div>
      )}
    </Stack>
  );
};

//탭기능함수
const Tab = ({ tabName, activeTab, handleTabClick }) => {
  return (
    <li className="nav-item">
      <a
        className={`nav-link ${activeTab === tabName ? "active" : ""}`}
        href="#"
        onClick={() => handleTabClick(tabName)}
      >
        {tabName}
      </a>
    </li>
  );
};

export default DetailMain;
