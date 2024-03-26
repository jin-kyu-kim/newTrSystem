import { useState } from 'react';
import { Switch } from 'devextreme-react/switch';
import './sysMng.css';

const ToggleButton = ({ data, callback }) => {
    console.log('data', data)
    const [isOn, setIsOn] = useState(data.displayValue === 'Y');
    const updateData = {
        key: data.key,
        data: {
            useYn: !isOn ? "Y" : "N"
        }
    };

    return (
        <Switch value={isOn} onValueChanged={() => {
            setIsOn(!isOn);
            callback && callback(updateData)
        }}/>
    );
}
export default ToggleButton;