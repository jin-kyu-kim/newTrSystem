import React, {useCallback, useEffect, useState} from "react";
import {TabPanel} from "devextreme-react";
import ProjectExpenseJson from "./ProjectExpenseJson.json"
import ProjectExpenseCell from "./ProjectExpenseCell";
import {useCookies} from "react-cookie";

const ProjectExpense = () => {
    const ExpenseInfo = ProjectExpenseJson.ExpenseInfo;
    const [index, setIndex] = useState(0);
    const [aplyYm, setAplyYm] = useState();
    const [aplyOdr, setAplyOdr] = useState();
    const [cookies] = useCookies([]);

    const empId = cookies.userInfo.empId;

    const onSelectionChanged = useCallback(
        (args) => {
            if (args.name === "selectedIndex") {
                setIndex(args.value);
            }
        },
        [setIndex]
    );


    useEffect(() => {

        const date = new Date();
        const year = date.getFullYear();
        const day = date.getDate();

        const month = day > 15 ? date.getMonth() + 1 : date.getMonth();

        let odrVal = day > 15 ? "1" : "2";
        let monthVal = month < 10 ? "0" + month : month;

        setAplyYm(year+monthVal);
        setAplyOdr(odrVal);

    }, []);

    const itemTitleRender = (a) => <span>{a.TabName}</span>;

    return (
        <div className="container">
            <ProjectExpenseCell/>
            <TabPanel
                height="auto"
                width="auto"
                dataSource={ExpenseInfo}
                selectedIndex={index}
                onOptionChanged={onSelectionChanged}
                itemTitleRender={itemTitleRender}
                animationEnabled={true}
                itemComponent={({ data }) => {
                    const Component = React.lazy(() => import(`${data.url}`));
                    return (
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Component
                                empId={empId}
                                index={index}
                                setIndex={setIndex}
                                aplyYm={aplyYm}
                                aplyOdr={aplyOdr}
                            />
                        </React.Suspense>
                    );
                }}
            />
        </div>
    );
};

export default ProjectExpense;