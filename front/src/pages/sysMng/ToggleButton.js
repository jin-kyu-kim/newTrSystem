import { useState, useEffect, useRef } from 'react';
import { Switch } from 'devextreme-react/switch';
import './sysMng.css';

const ToggleButton = ({ data, callback, colData }) => {
    const [isOn, setIsOn] = useState(data.value === 'Y');
    const prevIsOnRef = useRef(isOn); // 이전 상태값을 저장하기 위한 ref

    useEffect(() => {
        // 현재 isOn 상태와 이전 isOn 상태가 다를 때만 콜백 함수 호출
        if (prevIsOnRef.current !== isOn) {
            const updateData = {
                key: data.key,
                data: { useYn: isOn ? "Y" : "N" },
                name: colData.key,
                data2: colData

            };
            callback && callback(updateData);
            prevIsOnRef.current = isOn;
        }
    }, [isOn, callback, data.key]);

    return (
        <Switch value={isOn} onValueChanged={() => setIsOn(!isOn)}/>
    );
};
export default ToggleButton;