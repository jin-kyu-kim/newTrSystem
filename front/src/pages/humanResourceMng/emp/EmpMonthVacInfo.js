import React from 'react';
import 'devextreme/dist/css/dx.light.css';
import {DataGrid} from 'devextreme-react/data-grid';
import Calandar from "../../../components/unit/Calandar"

const defaultColumn = ['일', '월', '화', '수', '목', '금', '토'];

function App() {
    return (
    <div className="container">
        <div className="col-md-10 mx-auto" style={{ marginTop: "20px", marginBottom: "10px" }}>
            <h1 style={{ fontSize: "30px" }}>월별휴가정보</h1>
        </div>
        <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
            <span>* 직원의 월별 휴가정보를 조회합니다.</span>
        </div>
        <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
            <span>년도_월_성명_검색버튼</span>
        </div>
        <div className="col-md-10 mx-auto" style={{ marginBottom: "20px" }}>
            <Calandar />
        </div>
    </div>
    );
}

export default App;
