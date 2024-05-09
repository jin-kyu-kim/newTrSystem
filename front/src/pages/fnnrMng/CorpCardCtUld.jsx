import { useState } from 'react';
import { Button, TextBox } from 'devextreme-react';
import HtmlEditBox from 'components/unit/HtmlEditBox';
import RadioGroup from 'devextreme-react/radio-group';
import ExcelUpload from "../../components/unit/ExcelUpload";
import CustomEmpComboBox from 'components/unit/CustomEmpComboBox';
import '../elecAtrz/ElecAtrz.css';

const CorpCardCtUld = () => {

    const [data, setData] = useState([]);
    const [excel, setExcel] = useState();
    const [selectedEmp, setSelectedEmp] = useState({});

    const column = {
        dataField: 'cn',
        placeholder: '내용을 입력해주세요.'
    };

    const uploadInfo = [
        { name: "업로드 대상(사번)", type: "selectBox" },
        {
            name: "업로드 구분", type: "radio", info: [
                { id: '0', text: '기업법인', ctAtrzSeCd: 'VTW01901' }
            ]
        },
        { name: "파일 업로드", type: "uploadBtn" },
        {
            name: "이메일 전송여부", type: "radio", info: [
                { id: '0', text: '전송' },
                { id: '1', text: '미전송' }
            ]
        }
    ];
    //ctAtrzSeCd: 'VTW01901'
    const onEmpChg = (data) => {
        setSelectedEmp(data[0]);
    };

    const formRender = (info) => {
        switch (info.type) {
            case 'selectBox':
                return (
                    <div style={{ display: 'flex' }}>
                        <CustomEmpComboBox
                            value={selectedEmp.empId}
                            readOnly={false}
                            useEventBoolean={true}
                            showClearButton={true}
                            onValueChange={onEmpChg}
                        />
                        {selectedEmp.empId && <TextBox value={selectedEmp.empno} />}
                    </div>
                )
            case 'radio':
                return (
                    <div style={{ height: '40px' }}>
                        <RadioGroup
                            items={info.info}
                            onValueChange={(e) => console.log('e', e)}
                            defaultValue={info.info[0].id}
                            valueExpr="id"
                            displayExpr="text"
                            layout="horizontal"
                        />
                    </div>
                )
            default:
                return (
                    <ExcelUpload excel={excel} setExcel={setExcel} />
                )
        }
    }
    console.log('excel', excel)

    return (
        <div className="container">
            <div className="mx-auto" style={{ textAlign: 'left', marginTop: "20px", marginBottom: "10px" }}>
                <h1 style={{ textAlign: 'left', fontSize: "30px", marginRight: "20px" }}>비용 엑셀 업로드</h1>
            </div>
            <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                <span>* 비용 엑셀파일을 업로드합니다.</span>
            </div>

            <div className="dtl-table">
                {uploadInfo.map((info, index) => (
                    <div style={{ display: 'flex', verticalAlign: 'middle' }} key={index}>
                        <div className="dtl-first-col">{info.name}</div>
                        <div className="dtl-val-col">

                            <div style={{ display: 'flex' }}>
                                {formRender(info)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: '30px' }}>
                <h6 style={{ margin: '0 10px 0 0', lineHeight: 'normal' }}>제목:</h6>
                <TextBox width={1000} placeholder='제목 입력' />
            </div>

            <div>
                <HtmlEditBox
                    column={column}
                    data={data}
                    setData={setData}
                    value={data.noticeCn}
                />
            </div>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button text='업로드' type='default' />
            </div>
        </div>
    )
}
export default CorpCardCtUld;