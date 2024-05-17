import ApiRequest from "../../utils/ApiRequest";
//회의실용
/*
* const room = {
*  type : "roomRes",                                               //회의실 예약 타입
*  state : "insert"                                                //CRUD상태(등록 ,수정 ,삭제)
*  resEmp: "empid값",                                              //예약자ID
*  toEmailList: ["empdi값", "empdi값"],                            //참가자ID
*  content : "회의타이틀"                                          //회의 내용(mtg_ttl)
*  code: "VTW04201",                                               //회의실 코드(cd_nm 값 설정)
*  startDate: "20240412",                                          //회의시작 시간
*  endDate: "20240412"                                             //회의끝 시간
* };
*/

//비용업로드
/* const param = {
  //  type : "expenseExl",                                            
      toEmpId: "515ad1c7-d21c-0e39-2c01-d266a05a55e2",              
      reportEmpId: "515ad1c7-d21c-0e39-2c01-d266a05a55e2",            
      title: title,                                                  
      content : content,                                      
      fileName: fileName                                 
  * };
*/

//전결
/*
* const elec = {
*   type : "elecAtrz",                                              //전자결재 타입
    toEmpId: "515ad1c7-d21c-0e39-2c01-d266a05a55e2",                //결재자
    reportEmpId: "515ad1c7-d21c-0e39-2c01-d266a05a55e2",            //기안자
    documentNumber: "NISA0002-1",                                   //전자결재 문서번호 + seq?
    title: "20240401~20240403 휴가결재 결재 요청 완료",
    content : "[20240401~20240403 휴가결재]에 대한 결재가 요청되었습니다",
    pageMove: false,
    moveUrl : "/elecAtrz/ElecAtrzDetail"
* };
*/

//프잭
/*
* const prjct = {
//  type : "project",                                               //프로젝트 타입
    state : "approval",                                             //현재 상태 (""-요청 , approval-승인 , reject-반려)
    toEmpId: "515ad1c7-d21c-0e39-2c01-d266a05a55e2",                //결재자
    reportEmpId: "515ad1c7-d21c-0e39-2c01-d266a05a55e2",            //기안자
    projectCode: "NISA0002",                                        //프로젝트 코드
    title: "2팀 프로젝트 결재 승인",                                //제목
    content : "[2팀 프로젝트]에 대한 결재가 승인되었습니다.",       //콘텐츠
    submitType: "VTW01502"                                          //결재 타입 (실행원가VTW01502 ,변경원가VTW01503)
* };
*/

export async function sendEmail(param) {
    try {
      const response = await ApiRequest('/boot/sysMng/sendEmail', param);
      return response.data;
    } catch (error) {
      console.error("Error sending email: ", error);
      throw new Error('이메일을 보내는 동안 오류가 발생했습니다.');
    }
  }