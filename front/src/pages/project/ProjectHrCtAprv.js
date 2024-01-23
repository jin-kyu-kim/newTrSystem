import { useEffect, useState } from "react";

import ApiRequest from "../../utils/ApiRequest";
import ProjectHrCtAprvJson from "./ProjectHrCtAprvJson.json";
import CustomTable from "../../components/unit/CustomTable";
import SearchPrjctSet from "../../components/composite/SearchPrjctSet";
import CustomPagination from "../../components/unit/CustomPagination";

import { Container } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

const ProjectHrCtAprv = () => {

    const [values, setValues] = useState([]);
    const [param, setParam] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);


    useEffect(() => {
        if(!Object.values(param).every((value) => value === "")) {
            pageHandle();
        };
    }, [param]);

    const searchHandle = async (initParam) => {
        setTotalPages(1);
        setCurrentPage(1);
        setParam({
            ...initParam,
            queryId: "projectMapper.retrievePrjctHrCtAprvList",
            currentPage: currentPage,
            startVal: 0,
            pageSize: pageSize,
        });
    }


    // 페이징 처리
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setParam({
            ...param,
            currentPAge: newPage + 1,
            startVal: (newPage - 1) * pageSize,
        });
    };

    // 페이지 사이즈 변경
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value * 1);
        setParam({
            ...param,
            currentPage: 1,
            startVal: 0,
            pageSize: e.target.value * 1,
        });
    };

    const pageHandle = async () => {
        try {
            const response = await ApiRequest("/boot/common/queryIdSearch", param);
            setValues(response);
            console.log(param);

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

    return (
        <div>
            <Container>
                <div
                    className="title p-1"
                    style={{ marginTop: "20px", marginBottom: "10px" }}>
                        <h1 style={{ fontSize: "40px" }}>프로젝트시간비용승인</h1>
                </div>
                <div className="col-md-10 mx-auto" style={{ marginBottom: "10px" }}>
                    <span>* 프로젝트를 조회합니다.</span>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <SearchPrjctSet callBack={searchHandle} />
                </div>
                <div>
                    검색된 건 수 : {totalItems} 건
                </div>
                <CustomTable headers={ProjectHrCtAprvJson} tbBody={values}/>
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChgPage={handlePageChange}
                    onSelectChg={handlePageSizeChange}
                />
            </Container>

        </div>
    );
};

export default ProjectHrCtAprv;