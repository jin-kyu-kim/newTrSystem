import { Button } from 'devextreme-react';
import React, { useEffect, useState, useCallback, } from 'react';
import Grid from './ElecAtrzFormManageGrid';
import CustomStore from 'devextreme/data/custom_store';
import Form, { Item, GroupItem, Label, FormTypes } from 'devextreme-react/form';
import { Switch } from 'devextreme-react/switch';

const ElecAtrzFormManage = ({}) => {

    const [test, setTest] = useState([]);

    const tasksStore = new CustomStore({
    load:() => { 
        return test; 
    },
    update: (key, status) => {
        const updatedTest = test.map((item) => {
            console.log("key", key)
            console.log("status", status)
            if(item.ID === key) {
            return { ...item, Status: status };
            }
            return item;
        })
        console.log("updatedTest",updatedTest)
        setTest(updatedTest)
    
        }
    });
 

    useEffect(()=> {
        setTest(
            [
              {ID: 1, Subject: "계약서품의", Status: 1, } 
            , {ID: 2, Subject: "재료비", Status: 2, }
            , {ID: 3, Subject: "경비청구", Status: 2, }
        ]
        )
    }, [])

    

return (
    <div className="container" style={{ marginTop: "30px" }}>
        <div>
            <h1>전자결재서식관리</h1>
            <p> * 현재 화면과 '전자결재' 메뉴에 '신규문서작성'에 표시되는 화면과 동일합니다.</p>
            <p> * '시스템관리 &gt; 코드관리' 메뉴에서 '전자결재 서식 구분'분류 추가로 입력 가능합니다.</p>
            <p> * '전자결재 서식 구분'코드에 추가 하였으나 화면에 나오지 않을 경우 신규폼 작성을통해 해당 코드에 신규 서식을 작성해 주시기 바랍니다.</p>
            <p> * 서식을 마우스로 그래그 앤 드롭으로 순서를 변경 할 수 있습니다.</p>
            <p> * 서식이 있는 자리에는 변경 할 수 없습니다. 서식을 다른곳으로 옮긴 후 작업해주세요.</p>
        </div>
        <div style={{margin:'20px'}} className="buttons" align="right">
            <Button text="Contained" type="success" stylingMode="contained">신규 서식 작성</Button>
            <Button text="Contained" type="default" stylingMode="contained">서식 위치 저장</Button>
        </div>

        <div className="tables">
            
            
            <div className="column" style={{display : 'flex'}}> 
                <div>
                <h4>* 계약 </h4>
                <Grid
                    tasksStore={tasksStore}
                    status={1}
                />
                </div>
            <div>
                <h4>* 경비 </h4>
                <Grid
                    tasksStore={tasksStore}
                    status={2}
                />
                </div>
            </div>
            <div style={{display : 'flex'}}>
            </div>
            <div className="column" style={{display : 'flex', marginTop: '20px'}}> 
                <div>
                <h4>* 지급 </h4>
                <Grid
                    tasksStore={tasksStore}
                    status={3}
                />
                </div>
                <div>
                <h4>* 품의 </h4>
                <Grid
                    tasksStore={tasksStore}
                    status={4}
                />
                </div>
            </div>
            <div className="column" style={{display : 'flex', marginTop: '20px'}}> 
            <div>
                <h4>* 인사/지원 </h4>
                <Grid
                    tasksStore={tasksStore}
                    status={5}
                />
            </div>
            <div>
                <h4>* 경영/영업 </h4>
                <Grid
                    tasksStore={tasksStore}
                    status={6}
                />
            </div>
            </div>
  </div>




    </div>
);

}

export default ElecAtrzFormManage;