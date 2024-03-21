import React, { useEffect, useState, useCallback, } from "react";
import CustomComboBox from "../../components/unit/CustomComboBox";

import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';


import GridTest from './GridTest.jsx';


import Form, {
    Item, GroupItem, Label, FormTypes,
  } from 'devextreme-react/form';

const ElecAtrzNewReq = () => {


    // useEffect(() => {
    //     console.log("신규 기안 문서 작성 팝업");

    // }, []);
    const [prjctId , setPrjctId] = useState("")
    const prjctList = 
    {
        tbNm: "PRJCT",
        valueExpr: "prjctId",
        displayExpr: "prjctNm",
        name: "prjctId",
    }

    const handleChgState = (e) => {
        console.log(e)
        setPrjctId(e.value)
    }

    const validateForm = useCallback((e) => {
        e.component.validate();
    }, []);

    // const store = new CustomStore({
    //     key: 'ID',

    //     load:(loadOptions) => { 

    //         return test
        
    //     },
    //     update: (key, value) => {
    //       console.log("store update")
    //       const updatedTest = test.map((item) => {
    //         console.log(item)
    //         console.log("key", key)
    //         console.log("status", value)
    //         if(item.ID === key) {
    //           return { ...item, Status: value };
    //         }
    //         return item;
    //       })
    //     //   console.log(updatedTest)
    //     //   setTest(updatedTest);
      
    //     }
    // });

    const [test, setTest] = useState([]);
    //         [{ID: 1, Subject: "Task 1", Priority: 1, Status: 1}
    //         , {ID: 2, Subject: "Task 2", Priority: 2, Status: 2}
    //     ]
    // )

    useEffect(()=> {
        setTest(
            [
            {ID: 1, Subject: "Task 1", Priority: 1, Status: 1}
            , {ID: 2, Subject: "Task 2", Priority: 2, Status: 2}
            , {ID: 3, Subject: "Task 3", Priority: 4, Status: 2}
        ]
        )
    }, [])

    const tasksStore = new CustomStore({
        load:() => { 
            return test;
        
        },
        update: (key, status) => {
            console.log("store update")
            const updatedTest = test.map((item) => {
              console.log(item)
              console.log("key", key)
              console.log("status", status)
              if(item.ID === key) {
                return { ...item, Status: status };
              }
              return item;
            })
            console.log(updatedTest)
          setTest(updatedTest)
        
          }
    });



    return (
        <div className="container">
            {/* <div>
                <div>
                    <h4>1. 프로젝트 / 팀 선택</h4>
                </div>
                <div>
                    <CustomComboBox props={prjctList} value={prjctId} onSelect={handleChgState} label="프로젝트" required={true} placeholder="프로젝트"/>
                </div>
                <div>
                    <h4>2. 서식 선택</h4>
                </div>
            </div> */}

            <hr/>


            <Form
                onContentReady={validateForm}
            >

                <Item
                >
                    <div>
                        <h4>1. 프로젝트 / 팀 선택</h4>
                    </div>
                    <div style={{width: "50%"}}>
                        <CustomComboBox props={prjctList} value={prjctId} onSelect={handleChgState} label="프로젝트" required={true} placeholder="프로젝트"/>
                    </div>
                    <div>
                        <h4>2. 서식 선택</h4>
                    </div>
                </Item>
                <GroupItem
                    colCount={4}
                    caption="계약"
                >
                    <Item>
                        <div style={{minHeight: "50px"}}>
                            <div style={{textAlign: "center", width: "100%"}}>
                                <a style={{textAlign: "center", width: "100%"}}>미리보기</a>
                                <a></a>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                </GroupItem>
                <GroupItem
                    colCount={4}
                    caption="경비"
                >
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                    <Item>
                        <div>1</div>
                    </Item>
                </GroupItem>
            </Form>

            <div className="tables">
                <div className="column">
                <GridTest
                tasksStore={tasksStore}
                    status={1}
                />
                </div>
                <div className="column">
                <GridTest
                tasksStore={tasksStore}
                    status={2}
                />
                <div className="column"></div>
                <GridTest
                tasksStore={tasksStore}
                    status={3}
                />

                </div>
            </div>
        </div>
    );

}

export default ElecAtrzNewReq;