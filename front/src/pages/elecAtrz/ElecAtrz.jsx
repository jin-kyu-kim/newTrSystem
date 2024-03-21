import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'devextreme-react/button';

const ElecAtrz = () => {
    const navigate = useNavigate();

    /**
     * 신규 기안 작성 버튼 클릭 이벤트
     */
    const onNewReq = async () => {
        navigate("../elecAtrz/ElecAtrzForm");
    }

    return (
        <>
            <div className="container">
                <div>전자결재</div>
                <div><Button text="신규 기안 작성" onClick={onNewReq}></Button></div>
            </div>
        </>
    );
}

export default ElecAtrz;