import React, { useEffect } from "react";

import {Button} from "devextreme-react/button"

const ElecAtrzHeader = ({contents, onClick}) => {

    const setButtons = () => {
        const result = [];

        contents.map((item) => {
            result.push(
                <Button id={item.id} onClick={onClick} text={item.text} />
            );
        });

        return result;
    }

    return (
        <div style={{display:"flex", justifyContent:"flex-start"}}>
            <div style={{float: "left", marginRight:"auto"}}>로고</div>
            <div style={{display: "inline-block"}}>
                {setButtons()}
            </div>
        </div>
    )
}
export default ElecAtrzHeader;