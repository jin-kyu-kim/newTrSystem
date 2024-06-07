import { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button"
import ProjectHrCtAprvJson from "./ProjectHrCtAprvJson.json";
import ApiRequest from "../../../utils/ApiRequest";
import CustomTable from "../../../components/unit/CustomTable";
import SearchPrjctSet from "../../../components/composite/SearchPrjctSet";
import "react-datepicker/dist/react-datepicker.css";

const ProjectHrCtAprv = () => {
    const [values, setValues] = useState([]);
    const [param, setParam] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userEmpId = userInfo.empId;
    const { keyColumn, queryId, tableColumns, searchParams } = ProjectHrCtAprvJson;
    const navigate = useNavigate();

    useEffect(() => {
        if (!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
    }, [param]);

    const searchHandle = async (initParam) => {
        setTotalPages(1);
        setCurrentPage(1);
        setParam({
            ...initParam,
            queryId: queryId,
            currentPage: currentPage,
            startVal: 0,
            pageSize: pageSize,
            empId: userEmpId,
        });
    }


    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);

            if (response.length !== 0) {
                setTotalPages(Math.ceil(response[0].totalItems / pageSize));
                setTotalItems(response[0].totalItems);
            } else {
                setTotalPages(1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onBtnClick = (button, data) => {
        navigate("/project/ProjectHrCtAprvDetail",
            {
                state: {
                    prjctId: data.prjctId,
                    prjctNm: data.prjctNm,
                    bgtMngOdr: data.bgtMngOdr
                }
            });
    }

    const buttonRender = (button, data) => {
        let render = true;
        if (data.prjctStleCd === "실행") {
            render = false
        }
        return (
            render && <Button name={button.name} text={button.text} onClick={(e) => onBtnClick(button, data)} />
        );
    }

    return (
        <div>
            <div className="title">프로젝트시간비용승인</div>
            <div className="title-desc">* 프로젝트를 조회합니다.</div>
            <div className="wrap_search" style={{ marginBottom: "20px" }}>
                <SearchPrjctSet callBack={searchHandle} props={searchParams} />
            </div>
            <div>
                검색된 건 수 : {totalItems} 건
            </div>
            <CustomTable keyColumn={keyColumn} columns={tableColumns} values={values} paging={true} buttonRender={buttonRender} onClick={onBtnClick} />
        </div>
    );
};
export default ProjectHrCtAprv;