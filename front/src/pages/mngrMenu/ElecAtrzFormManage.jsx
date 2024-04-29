import React, { useCallback, useEffect, useState } from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import Sortable from 'devextreme-react/sortable';
import "./ElecAtrzFormManageStyles.css";
import { Button } from 'devextreme-react/button';
import { Switch } from 'devextreme-react/switch';
import { useNavigate } from 'react-router-dom';
import ApiRequest from 'utils/ApiRequest';


// 배열에서 아이템 삭제, 추가, 재배열하는 함수들
function removeItem(array, removeIdx) {
  return array.filter((_, idx) => idx !== removeIdx);
}
function insertItem(array, item, insertIdx) {
  const newArray = [...array];
  newArray.splice(insertIdx, 0, item);
  return newArray;
}
function reorderItem(array, fromIdx, toIdx) {
  const item = array[fromIdx];
  const result = removeItem(array, fromIdx);
  return insertItem(result, item, toIdx);
}


// 화면에 리스트를 보여주는 컴포넌트
const  ElecAtrzFormManage = ({}) => {

  const [statuses, setStatuses] = useState([]);
  const [formList, setFormList] = useState([]); //전자결재문서서식 리스트
  const [lists, setLists] = useState([]); // 리스트 상태
  const navigate = useNavigate();
 
  const getLists = (taskArray) => {
    const tasksMap = taskArray.reduce((result, task) => {
      if (result[task.docSeCdNm]) {
        result[task.docSeCdNm].push(task);
      } else {
        result[task.docSeCdNm] = [task];
      }
      return result;
    }, {});

    setStatuses(Object.keys(tasksMap));
    return Object.keys(tasksMap).map((key) => tasksMap[key]);
  }

  useEffect(() => {
    console.log("formList",formList);
  }, [formList]);

  useEffect(() => {
    console.log("lists",lists);
  }, [lists]);


  //전자결재문서서식 리스트 가져오기
  useEffect(() => {
    const param = [ { tbNm: "ELCTRN_ATRZ_DOC_FORM" },{} ]

    const getElecaAtrzFormList = async () => {
      try {
        const response = await ApiRequest("/boot/common/commonSelect", param);
        setFormList(response);
      } catch (error) {
        console.log(error);
      }
    }
    getElecaAtrzFormList();
  }, []);
  
  useEffect(() => {
    if (formList.length > 0) {
      const lists = getLists(formList);
      const newLists = lists.filter((list) => list !== undefined);  //undefined인 리스트는 제외
      setLists(newLists); // lists 상태 업데이트
    }
  }, [formList]); // formList 상태가 변경될 때마다 실행

  const onListReorder = useCallback(({ fromIndex, toIndex }) => {
    setLists((state) => reorderItem(state, fromIndex, toIndex));
    setStatuses((state) => reorderItem(state, fromIndex, toIndex));
  }, []);

  // card가 다른 list로 이동할 때
  const onTaskDrop = useCallback(
    ({
      fromData, toData, fromIndex, toIndex,
    }) => {
      const updatedLists = [...lists];
      const item = updatedLists[fromData][fromIndex];
      updatedLists[fromData] = removeItem(updatedLists[fromData], fromIndex);
      updatedLists[toData] = insertItem(updatedLists[toData], item, toIndex);
      setLists(updatedLists);
    },
    [lists],
  );

  //Card 컴포넌트
const Card = ({ task, switchUseYn, switchEprssYn }) => ( //TODO.우선순위에 따라 카드색깔 변경  >> 이걸 서식 종류에 따라 색깔 바꾸게 하면 될듯
<div className="card dx-card dx-theme-text-color dx-theme-background-color">
  <div className={`card-priority priority-${task.Task_Priority}`}></div>  
  <div className="card-subject">{task.gnrlAtrzTtl}</div>
  <Button text='수정' 
  onClick={(e)=>{
    navigate("/mngrMenu/ElecAtrzNewForm", {state : task});
    }}
    >
  </Button> 
  <div style={{display:'flex', alignSelf:'center', marginTop:'10px'}}>
    <div className='switch-name'>서식사용</div> 
    <Switch 
      value={switchUseYn} 
      onValueChanged={()=>{}}/>
    <div className='switch-name'style={{ marginLeft:'20px'}}>화면표시</div> 
    <Switch 
      value={switchEprssYn} 
      onValueChanged={()=>{}}/>
  </div>
</div>
); 

//List 컴포넌트
const List = ({
title, index, tasks, onTaskDrop,
}) => (
<div className="list">
  <div className="list-title dx-theme-text-color">{title}</div>
  <ScrollView
    className="scrollable-list"
    direction="vertical"
    showScrollbar="always"
  >
    <Sortable
      className="sortable-cards"
      group="cardsGroup"
      data={index}
      onReorder={onTaskDrop}
      onAdd={onTaskDrop}
    >
      {tasks.map((task) => (
        <Card
          key={task.atrzFormDocSn}
          task={task}
          switchUseYn={task.useYn === 'Y' ? true : false}
          switchEprssYn={task.eprssYn === 'Y' ? true : false}
        ></Card>
      ))}
    </Sortable>
  </ScrollView>
</div>
);

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
          <Button text="Contained" type="success" stylingMode="contained" onClick={(e)=>{navigate("/mngrMenu/ElecAtrzNewForm")}}>신규 서식 작성</Button>
          <Button text="Contained" type="default" stylingMode="contained">서식 위치 저장</Button>
      </div>

      <div id="kanban">
        <ScrollView
          className="scrollable-board"
          direction="horizontal"
          showScrollbar="always"
        >
          <Sortable
            className="sortable-lists"
            itemOrientation="horizontal"
            handle=".list-title"
            onReorder={onListReorder}
          >
            <div className="cards-container">
              {/* {console.log("lists",lists)} */}
              {lists.map((tasks, listIndex) => {
                const status = statuses[listIndex];
                return (
                  <List
                    key={status}
                    title={status}
                    index={listIndex}
                    tasks={tasks}
                    onTaskDrop={onTaskDrop}
                  ></List>
                );
              })}
            </div>
          </Sortable>
        </ScrollView>
      </div>
    </div>
  );
}
export default ElecAtrzFormManage;
