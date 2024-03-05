import { useState } from 'react';
import { Switch } from 'devextreme-react/switch';
import './sysMng.css';

const ToggleButton = ({ data, callback, idColumn }) => {
    const [isOn, setIsOn] = useState(data.useYn === 'Y');
    return (
        <Switch value={isOn} onValueChanged={() => {
            setIsOn(!isOn);
            callback(idColumn, !isOn ? "Y" : "N")
        }}/>
    );
}
export default ToggleButton;