import { Popup } from "devextreme-react";

// 테이블 import
// npm install @mui/material
import { Table, TableCell, TableHead, TableBody, TableRow } from '@mui/material';

const EmpVacationCondolencePopup = ({ width, height, visible, onHiding, type }) => {

    function createCancleRender() {
        return (
            <>  {
                type && type == "condolence"
                    ?
                    <div className="row">
                        <div>* 결재선</div>
                        <div style={{ marginTop: "5px", fontWeight: "bold", fontSize: "16px" }}>승인 : 조미리애 대표 <br />참조 : 오현석 상무 </div>
                        <div style={{ marginTop: "20px" }}>
                            <span>* 기준안내</span>
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC", background: "#EEEEEE" }}>
                                    <TableCell colSpan={2} style={tableHeaderStyle}>구분</TableCell>
                                    <TableCell style={tableHeaderStyle}>휴가일수<br />(워크데이 기준)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell rowSpan={3} style={hedearStyle}>결혼</TableCell>
                                    <TableCell style={textStyle}>본인</TableCell>
                                    <TableCell style={textStyle}>7일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>자녀</TableCell>
                                    <TableCell style={textStyle}>3일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>형제, 자매</TableCell>
                                    <TableCell style={textStyle}>1일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>출산</TableCell>
                                    <TableCell style={textStyle}>배우자</TableCell>
                                    <TableCell style={textStyle}>10일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell rowSpan={6} style={hedearStyle}>사망</TableCell>
                                    <TableCell style={textStyle}>배우자</TableCell>
                                    <TableCell style={textStyle}>5일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>자녀</TableCell>
                                    <TableCell style={textStyle}>5일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>부모 / 배우자의 부모</TableCell>
                                    <TableCell style={textStyle}>5일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>형제 / 자매</TableCell>
                                    <TableCell style={textStyle}>5일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>조부모, 배우자의 조부모</TableCell>
                                    <TableCell style={textStyle}>5일</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={textStyle}>외조부모</TableCell>
                                    <TableCell style={textStyle}>5일</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div style={{ marginTop: "20px" }}>
                            <span>* 첨부서류</span>
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC", background: "#EEEEEE" }}>
                                    <TableCell style={tableHeaderStyle}>구분</TableCell>
                                    <TableCell style={tableHeaderStyle}>첨부서류<br />(미첨부 시 연차 소진)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={hedearStyle}>경조휴가</TableCell>
                                    <TableCell style={textStyle}>가족관계증명서 및 청첩장(결혼), 사망진단서 또는 부고장(사망)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>출산휴가 및 육아휴직</TableCell>
                                    <TableCell style={textStyle}>임신확인서 또는 진단서</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>배우자 출산휴가</TableCell>
                                    <TableCell style={textStyle}>출생신고서</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>예비군 및 민방위</TableCell>
                                    <TableCell style={textStyle}>소집통지서 등</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>건강검진</TableCell>
                                    <TableCell style={textStyle}>건강검진 완료 후 건강 검진 실시 확인서</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    : type && type == "official"
                        ?
                        <>
                            <div> <span>* 첨부서류</span> </div>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ borderTop: "2px solid #CCCCCC", borderBottom: "2px solid #CCCCCC", background: "#EEEEEE" }}>
                                        <TableCell style={tableHeaderStyle}>구분</TableCell>
                                        <TableCell style={tableHeaderStyle}>첨부서류<br />(미첨부 시 연차 소진)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* <TableRow>
                                    <TableCell style={hedearStyle}>경조휴가</TableCell>
                                    <TableCell style={textStyle}>가족관계증명서 및 청첩장(결혼), 사망진단서 또는 부고장(사망)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>출산휴가 및 육아휴직</TableCell>
                                    <TableCell style={textStyle}>임신확인서 또는 진단서</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={hedearStyle}>배우자 출산휴가</TableCell>
                                    <TableCell style={textStyle}>출생신고서</TableCell>
                                </TableRow> */}
                                    <TableRow>
                                        <TableCell style={hedearStyle}>예비군 및 민방위</TableCell>
                                        <TableCell style={textStyle}>소집통지서 등</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={hedearStyle}>건강검진</TableCell>
                                        <TableCell style={textStyle}>건강검진 완료 후 건강 검진 실시 확인서</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </>
                        : <></>
            }
            </>
        )
    }

    return (
        <>
            <Popup
                width={width}
                height={height}
                visible={visible}
                title={"안내사항"}
                showCloseButton={true}
                contentRender={createCancleRender}
                onHiding={() => { onHiding(false) }}
            />
        </>
    )
}

export default EmpVacationCondolencePopup;

const hedearStyle = {
    textAlign: "center",
    fontSize: "12px",
}

const textStyle = {
    textAlign: "center",
    borderLeft: "1px solid #CCCCCC",
    fontSize: "13px",
    padding: "5px"
}

const tableHeaderStyle = {
    textAlign: "center",
    borderLeft: "1px solid #CCCCCC",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "5px"
}