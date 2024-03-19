import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'devextreme-react';
import DataGrid, {
  Column, RowDragging, Scrolling, Lookup,
} from 'devextreme-react/data-grid';
import { Switch } from 'devextreme-react/switch';
import { eachHourOfInterval } from 'date-fns';


const ElecAtrzFormManageGrid = ({ tasksStore, status }) => {
  const [filterExpr] = useState(['Status', '=', status]);
  const [dataSource] = useState({
    store: tasksStore,
    reshapeOnPush: true,
  });

  const onAdd = useCallback(
    (e) => {
      console.log("e", e)
      const key = e.itemData.ID;
      const status = e.toData;

      tasksStore.update(key, status );
    }, [tasksStore]
  );

  return (
    <DataGrid
      dataSource={tasksStore}
      height={440}
      showBorders={true}
      filterValue={filterExpr}
    >
      <RowDragging
        data={status}
        group="tasksGroup"
        onAdd={onAdd}
      />
      <Scrolling mode="virtual" />
      <Column
        dataField="Subject"
        dataType="string"
      />
      <Column
        dataField="서식사용"
        dataType="number"
        width={100}
        cellRender={({ data, key }) => (
          <Switch></Switch>
        )}
      >
      </Column>
      <Column
        dataField="화면표시"
        dataType="number"
        width={100}
        cellRender={({ data, key }) => (
          <Switch></Switch>
        )}
      >
      </Column>
      <Column
        dataField="수정"
        dataType="number"
        width={100}
        cellRender={({ data, key }) => (
          <Button>수정</Button>
        )}
      ></Column>
      <Column
        dataField="Status"
        dataType="number"
        visible={false}
      />
    </DataGrid>
  );
};
export default ElecAtrzFormManageGrid;
