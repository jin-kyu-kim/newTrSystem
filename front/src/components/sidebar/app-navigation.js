export const navigation = [
  {
    text: '정보조회',
    icon: 'info',
    auth: 'USER',
    items: [
      {
        text: '개인정보관리',
        path: '/infoInq/EmpDetailInfo',
        auth: 'USER'
      },
      {
        text: '직원조회',
        path: '/infoInq/EmpList',
        auth: 'USER'
      },{
        text: '공지사항',
        path: '/infoInq/NoticeList',
        auth: 'USER'
      },{
        text: '자료실',
        path: '/infoInq/ReferenceList',
        auth: 'USER'
      },{
        text: '회의실예약',
        path: '/humanResourceMng/MeetingRoomManage',
        auth: 'VTW04805'
      }
      // ,{
      //   text: '법제도',
      //   path: '/infoInq/LawRules',
      //   auth: 'USER'
      // },
    ]
  }, {
    text: '개인청구',
    icon: 'money',
    items: [
      {
        text: '근무시간',
        path: '/indvdlClm/EmpWorkTime',
        auth: 'USER'
      },
      {
        text: '프로젝트비용',
        path: '/indvdlClm/ProjectExpense',
        auth: 'USER'
      },{
        text: '휴가',
        path: '/indvdlClm/EmpVacation',
        auth: 'USER'
      },{
        text: '문화체련비',
        path: '/indvdlClm/CultureHealthCost',
        auth: 'USER'
      }
    ]
  }, {
    text: '프로젝트',
    icon: 'product',
    auth: 'VTW04807',
    items: [
      {
        text: '프로젝트관리',
        path: '/project/ProjectList',
        auth: 'VTW04807'
      },
      {
        text: '프로젝트승인',
        path: '/project/ProjectAprv',
        auth: 'VTW04807'
      },{
        text: '프로젝트시간비용승인',
        path: '/project/ProjectHrCtAprv',
        auth: 'VTW04807'
      },{
      //   text: '외주비용승인',
      //   path: '/project/ProjectOutordAprv',
      //   auth: 'VTW04807'
      // },{
        text: '파트너업체관리',
        path: '/project/ProjectOutordCompany'
      },{
        text: '파트너직원관리',
        path: '/project/ProjectOutordEmp'
      },
    ]
  }, {
    text: '인사관리',
    icon: 'group',
    auth: 'VTW04805',
    items: [
      {
        text: '부서관리',
        path: '/humanResourceMng/DeptManage',
        auth: 'VTW04805'
      },{
        text: '직원관리',
        path: '/humanResourceMng/EmpManage',
        auth: 'VTW04805'
      },{
        text: '휴가배정관리',
        path: '/humanResourceMng/EmpVcatnAltmntMng',
        auth: 'VTW04805'
      },{
        text: '월별휴가정보',
        path: '/humanResourceMng/EmpMonthVacInfo',
        auth: 'VTW04805'
      },{
        text: '휴가사용내역',
        path: '/humanResourceMng/EmpVacUseList',
        auth: 'VTW04805'
      },{
        text: '회의실예약관리',
        path: '/humanResourceMng/MeetingRoomManageAdmin',
        auth: 'VTW04805'
      },
    ]
  }, {
    text: '재무관리',
    icon: 'folder',
    auth: 'VTW04804',
    items: [
      {
        text: '프로젝트비용청구현황',
        path: '/fnnrMng/ProjectClaimCost',
        auth: 'VTW04804',
      },{
        text: '근무시간승인내역',
        path: '/fnnrMng/EmpTimeAprvList',
        auth: 'VTW04804',
      },{
        text: '경비승인내역',
        path: '/fnnrMng/EmpExpenseAprvList',
        auth: 'VTW04804',
      },{
        text: '근무시간,경비통합',
        path: '/fnnrMng/EmpTRCostTotal',
        auth: 'VTW04804',
      },{
        text: '문화체련비관리',
        path: '/fnnrMng/EmpCultHealthCostManage',
        auth: 'VTW04804',
      },{
        text: '근무시간비용입력현황',
        path: '/fnnrMng/TimeExpenseInsertSttus',
        auth: 'VTW04804',
      },{
        text: '비용엑셀업로드',
        path: '/fnnrMng/CorpCardCtUld',
        auth: 'VTW04804' 
      },
    ]
  },{
    text: '전자결재',
    path: '/elecAtrz/ElecAtrz',
    icon: 'importselected',
    auth: 'USER'
  }, {
    text: '시스템관리',
    icon: 'folder',
    auth: 'VTW04803',
    items: [
      {
        text: '권한관리',
        path: '/sysMng/EmpAuth',
        auth: 'VTW04801'
      },{
        text: '코드관리',
        path: '/sysMng/TrsCode',
        auth: 'VTW04801'
      },{
        text: '고객사관리',
        path: '/sysMng/CustomersList',
        auth: 'VTW04803'
      },{
        text: '휴일관리',
        path: '/sysMng/HolidayMng',
        auth: 'VTW04801'
      }
    ]
  }, {
    text: '관리자메뉴',
    icon: 'preferences',
    auth: 'VTW04801',
    items: [
      {
        text: '프로젝트관리',
        path: '/mngrMenu/ProjectList',
        auth: 'VTW04801'
      },{
        text: '프로젝트승인',
        path: '/mngrMenu/ProjectAprv',
        auth: 'VTW04801'
      },{
        text: '전자결재',
        path: '/mngrMenu/ElecAtrzManage',
        auth: 'VTW04801'
      },{
        text: '전자결재서식관리',
        path: '/mngrMenu/ElecAtrzFormManage',
        auth: 'VTW04801'
      }
      // ,{
      //   text: '개발및연구',
      //   path: '/75',
      //   auth: 'VTW04801'
      // },{
      //   text: 'MM확인하기',
      //   path: '/76',
      //   auth: 'VTW04801'
      // },
    ]
  },{
    text: '오류게시판',
    path: '/sysMng/CsServiceList',
    icon: 'importselected',
    auth: 'USER'
  },
  ];
