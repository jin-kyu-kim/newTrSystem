export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: '정보조회',
    icon: 'info',
    items: [
      {
        text: '개인정보관리',
        path: 'infoInq/EmpDetailInfo'
      },
      {
        text: '직원조회',
        path: 'infoInq/EmpList'
      },{
        text: '공지사항',
        path: 'infoInq/NoticeList'
      },{
        text: '자료실',
        path: 'infoInq/ReferenceList'
      },{
        text: '회의실예약',
        path: 'infoInq/MeetingRoomReserv'
      },{
        text: '법제도',
        path: 'infoInq/LawRules'
      },
      
    ]
  }, {
    text: '개인청구',
    icon: 'money',
    items: [
      {
        text: '근무시간',
        path: 'indvdlClm/EmpWorkTime'
      },
      {
        text: '프로젝트비용',
        path: 'indvdlClm/ProjectExpense'
      },{
        text: '휴가',
        path: 'indvdlClm/EmpVacation'
      },{
        text: '문화체련비',
        path: 'indvdlClm/CultureHealthCost'
      }
    ]
  }, {
    text: '프로젝트',
    icon: 'product',
    items: [
      {
        text: '프로젝트관리',
        path: 'project/ProjectList'
      },
      {
        text: '프로젝트승인',
        path: 'project/ProjectAprv'
      },{
        text: '프로젝트시간비용승인',
        path: 'project/ProjectHrCtAprv'
      },{
        text: '외주비용승인',
        path: 'project/ProjectOutordAprv'
      },{
        text: '파트너업체관리',
        path: '/25'
      },{
        text: '파트너직원관리',
        path: '/26'
      },
    ]
  }, {
    text: '인사관리',
    icon: 'group',
    items: [
      {
        text: '부서관리',
        path: 'humanResourceMng/DeptManage'
      },{
        text: '직원관리',
        path: 'humanResourceMng/EmpManage'
      },{
        text: '휴가배정관리',
        path: 'humanResourceMng/EmpVcatnAltmntMng'
      },{
        text: '월별휴가정보',
        path: 'humanResourceMng/EmpMonthVacInfo'
      },{
        text: '휴가사용내역',
        path: 'humanResourceMng/EmpVacUseList'
      },{
        text: '회의실예약관리',
        path: 'humanResourceMng/MeetingRoomManage'
      },
    ]
  }, {
    text: '재무관리',
    icon: 'folder',
    items: [
      {
        text: '프로젝트비용청구현황',
        path: 'fnnrMng/ProjectClaimCost'
      },
      {
        text: '근무시간승인내역',
        path: 'fnnrMng/EmpTimeAprvList'
      },{
        text: '경비승인내역',
        path: 'fnnrMng/EmpExpenseAprvList'
      },
      {
        text: '근무시간,경비통합',
        path: 'fnnrMng/EmpTRCostTotal'
      },{
        text: '문화체련비관리',
        path: 'fnnrMng/EmpCultHealthCostManage'
      },{
        text: '근무시간비용입력현황',
        path: 'fnnrMng/TimeExpenseInsertSttus'
      },{
        text: '비용엑셀업로드',
        path: '/46'
      },
      
    ]
  },{
    text: '전자결재',
    path: 'elecAtrz/ElecAtrz',
    icon: 'importselected'
  }, {
    text: '시스템관리',
    icon: 'folder',
    items: [
      {
        text: '권한관리',
        path: 'sysMng/EmpAuth'
      },
      {
        text: '권한부여관리',
        path: 'sysMng/EmpAuthorization'
      },{
        text: '코드관리',
        path: 'sysMng/TrsCode'
      },{
        text: '고객사관리',
        path: 'sysMng/CustomersList'
      }
    ]
  }, {
    text: '관리자메뉴',
    icon: 'preferences',
    items: [
      {
        text: '프로젝트관리',
        path: '/71'
      },
      {
        text: '프로젝트승인',
        path: '/72'
      },{
        text: '전자결재서식관리',
        path: 'mngrMenu/ElecAtrzFormManage'
      },{
        text: '전자결재',
        path: 'mngrMenu/ElecAtrzManage'
      },{
        text: '개발및연구',
        path: '/75'
      },{
        text: 'MM확인하기',
        path: '/76'
      },
    ]
  }
  ];
