import { Button } from "devextreme-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import ApiRequest from "utils/ApiRequest";

const NoticeDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const noticeId = location.state.id;
    const [oneData, setOneData] = useState({
        noticeTtl: "",
        noticeCn: "",
        regEmpId: "",
        regDt: "",
    });

    useEffect(() => {
        const getOneData = async () => {
            const params = [{ tbNm: "NOTICE" }, { noticeId: noticeId }];
            try {
                const response = await ApiRequest("/boot/common/commonSelect", params);
                setOneData(response[0]);
            } catch (error) {
                console.log(error);
            }
        };

        getOneData();
    }, [noticeId]);

    const deleteNotice = async () => {
        const params = [{ tbNm: "NOTICE" }, { noticeId: noticeId }]
        try {
            const response = await ApiRequest("/boot/common/commonDelete", params);
            if (response === 1) {
                navigate("/infoInq/NoticeList")
            } else { alert('삭제 실패') }
        } catch (error) {

        }
    }

    return (
        <div className="container">
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <div style={{ marginRight: "20px", marginLeft: "20px" }}>
                    <h1 style={{ fontSize: "30px" }}>공지사항</h1>
                </div>

                <div>제목 : {oneData.noticeTtl}</div>
                <div>
                    내용:  <div dangerouslySetInnerHTML={{ __html: oneData.noticeCn }} />
                </div>
                <div>작성자 : {oneData.regEmpId}</div>
                작성일 : {oneData.regDt}

                첨부파일
            </div>

            <Button
                id="button"
                text="목록"
                className="btn_submit filled_gray"
                onClick={() => navigate("/infoInq/NoticeList")}
            />
            <Button
                id="button"
                text="수정"
                className="btn_submit filled_gray"
                onClick={() => navigate("/infoInq/NoticeInput", {
                    state: { 
                        id: noticeId, 
                        editMode: "update"
                    }
                })}
            />
            <Button
                id="button"
                text="삭제"
                className="btn_submit filled_blue"
                onClick={deleteNotice}
            />
        </div>
    );
};
export default NoticeDetail;
