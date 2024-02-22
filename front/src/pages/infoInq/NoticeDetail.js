import { useLocation } from "react-router-dom";

const NoticeDetail = () => {

    const location = useLocation();

    return (
        <div className='container'>
            <div
                className="title p-1"
                style={{ marginTop: "20px", marginBottom: "10px" }}
            >
                <div style={{ marginRight: "20px", marginLeft: "20px" }}>
                    <h1 style={{ fontSize: "30px" }}>공지사항</h1>
                    <div>{location.state.noticeTtl}</div>
                </div>

                <div>
                    <div>{location.state.noticeCn}</div>
                </div>
            </div>
        </div>

    )
}
export default NoticeDetail;