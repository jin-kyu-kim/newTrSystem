import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { TbX } from "react-icons/tb";

const DetailAcbg = () => {
  const [acbg, setAcbg] = useState([]);
  const reqCode = ["VTW029", "VTW030", "VTW031"]; //VTW029	학력구분코드, VTW030	졸업상태코드, VTW031	학점만점구분코드

  const [vtw029, setvtw029] = useState([]);
  const [vtw030, setvtw030] = useState([]);
  const [vtw031, setvtw031] = useState([]);

  const initFrom = {
    acbgSn: "",
    acbgSeCd: "",
    schlNm: "",
    majorIntltshNm: "",
    grdtnSttsCd: "",
    pntPscoreSeCd: "",
    screScore: "",
    mtcltnYr: "",
    grdtnYr: "",
  };
  const [formData, setFormData] = useState(initFrom);
  const [errors, setErrors] = useState(initFrom);

  const handleInputChange = ({ target: { name, value } }) => {
    setErrors({ ...errors, [name]: "" });
    setFormData({ ...formData, [name]: value });
  };

  const validateInput = (name, value, tagName, placeholder, selectedOption) => {
    let errorMessage = "";

    if (tagName === "INPUT" && !value && name !== "grdtnYr") {
      errorMessage = `${placeholder}은 필수로 입력되어야 합니다.`;
      setErrors({ ...errors, [name]: errorMessage });
      return;
    }
    if (tagName === "SELECT" && !value) {
      errorMessage = `${selectedOption}은 필수로 입력되어야 합니다.`;
      setErrors({ ...errors, [name]: errorMessage });
      return;
    }

    if (name === "screScore") {
      const pntPscore = formData.pntPscoreSeCd === "VTW03101" ? 4.3 : 4.5;
      if (isNaN(value)) {
        errorMessage = "숫자를 입력해야 합니다.";
        setErrors({ ...errors, [name]: errorMessage });
        return;
      } else if (value > pntPscore) {
        errorMessage = "만점보다 높을 수 없습니다.";
        setErrors({ ...errors, [name]: errorMessage });
        return;
      }
    }

    if (name === "mtcltnYr" || name === "grdtnYr") {
      const currentYear = new Date().getFullYear();
      if (isNaN(value)) {
        errorMessage = "숫자를 입력해야 합니다.";
        setErrors({ ...errors, [name]: errorMessage });
        return;
      } else if (value < 1900 || value > currentYear) {
        errorMessage = `연도는 1900연도와 ${currentYear} 사이 값만 가능합니다.`;
        setErrors({ ...errors, [name]: errorMessage });
        return;
      } else if (name === "grdtnYr" && formData.mtcltnYr > value) {
        errorMessage = "졸업년도는 입학년도보다 빠를 수 없습니다.";
        setErrors({ ...errors, [name]: errorMessage });
        return;
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value, tagName, placeholder } = e.target;
    let selectedOption = "";
    if (e.target.options) {
      selectedOption = e.target.options[e.target.selectedIndex].text;
    }
    validateInput(name, value, tagName, placeholder, selectedOption);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formArr = event.target;
    let selectedOption = "";

    for (let i = 0; i < formArr.length - 2; i++) {
      if (formArr[i].options) {
        selectedOption = formArr[i].options[formArr[i].selectedIndex].text;
      }
      validateInput(
        formArr[i].name,
        formArr[i].value,
        formArr[i].tagName,
        formArr[i].placeholder,
        selectedOption
      );
    }

    for (const fieldName of Object.keys(errors)) {
      if (errors[fieldName] !== "") {
        alert(`${errors[fieldName]}`);
        return;
      }
    }
    const saveConfirmed = window.confirm("저장 하시겠습니까?");
    if (saveConfirmed) {
      axios
        .post("/boot/saveAcbg", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          axios
            .get("/boot/acbg")
            .then((response1) => {
              setAcbg(response1.data);
            })
            .catch((errors) => {
              console.log(errors);
            });
          setFormData(initFrom);
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
  };

  const handleReset = () => {
    setFormData(initFrom);
    setErrors(initFrom);
  };

  // 테이블 행 클릭 시 해당 데이터를 폼에 빌드하는 함수
  const handleTableRowClick = (item) => {
    if (item && Object.values(item).length > 0) {
      setFormData(item);
      setErrors(initFrom);
    }
  };

  useEffect(() => {
    axios
      .all([
        axios.get("/boot/acbg"), //학력 조회
        axios.get(`/boot/code?code=${reqCode}`),
      ])
      .then(
        axios.spread((response1, response2) => {
          setAcbg(response1.data);
          setvtw029(getLabelFromCode(response2.data.VTW029));
          setvtw030(getLabelFromCode(response2.data.VTW030));
          setvtw031(getLabelFromCode(response2.data.VTW031));
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  }, []);

  // 코드를 라벨로 변환하는 함수
  const getLabelFromCode = (data) => {
    const codeToLabel = {};
    data.forEach((item) => {
      codeToLabel[item.cd] = item.cdNm;
    });
    return codeToLabel;
  };

  //삭제 함수
  const onDelClick = (index) => {
    const userConfirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (!userConfirmed) {
      return;
    }

    const itemToDelete = acbg[index];
    const deleteParam = JSON.stringify(itemToDelete);

    axios
      .post("/boot/deleteAcbg", deleteParam, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setFormData(initFrom);
        axios
          .get("/boot/acbg")
          .then((response1) => {
            setAcbg(response1.data);
          })
          .catch((errors) => {
            console.log(errors);
          });
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
    <div>
      <div>
        <Table bordered hover>
          <thead className="table-light">
            <tr>
              <th>구분</th>
              <th>학교명</th>
              <th>전공(계열)</th>
              <th>졸업구분</th>
              <th>성적</th>
              <th>입학년도</th>
              <th>졸업년도</th>
            </tr>
          </thead>
          <tbody>
            {acbg.map((item, index) => (
              <tr key={index} onClick={() => handleTableRowClick(item)}>
                <td>
                  <Button variant="outline" onClick={() => onDelClick(index)}>
                    <TbX className="tbx" />
                  </Button>{" "}
                  {vtw029[item.acbgSeCd]}
                </td>
                <td>{item.schlNm}</td>
                <td>{item.majorIntltshNm}</td>
                <td>{vtw030[item.grdtnSttsCd]}</td>
                <td>
                  {item.pntPscoreSeCd
                    ? `${item.screScore} (만점: ${vtw031[item.pntPscoreSeCd]}` +
                      ")"
                    : ""}
                </td>
                <td>{item.mtcltnYr}</td>
                <td>{item.grdtnYr}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Form onSubmit={handleSubmit} className="form-container">
        <h4>학력을 입력/수정합니다.</h4>
        <Row className="mb-3">
          <Form.Group sm="3" as={Col} controlId="formGridState">
            <Form.Select
              name="acbgSeCd"
              value={formData.acbgSeCd}
              onChange={handleInputChange}
              onBlur={handleBlur}
            >
              <option value="">[ 학교구분 ]</option>
              {Object.entries(vtw029).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group sm="3" as={Col} controlId="formGridCity">
            <Form.Control
              name="schlNm"
              value={formData.schlNm}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="학교명"
            />
          </Form.Group>
          <Form.Group sm="4" as={Col} controlId="formGridZip">
            <Form.Control
              name="majorIntltshNm"
              value={formData.majorIntltshNm}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="전공(계열)"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group sm="2" as={Col} controlId="formGridState">
            <Form.Select
              name="grdtnSttsCd"
              value={formData.grdtnSttsCd}
              onChange={handleInputChange}
              onBlur={handleBlur}
            >
              <option value="">[ 졸업구분 ]</option>
              {Object.entries(vtw030).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group sm="2" as={Col} controlId="formGridState">
            <Form.Select
              name="pntPscoreSeCd"
              value={formData.pntPscoreSeCd}
              onChange={handleInputChange}
              onBlur={handleBlur}
            >
              <option value="">[ 학점만점 ]</option>
              {Object.entries(vtw031).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group sm="2" as={Col} controlId="formGridCity">
            <Form.Control
              name="screScore"
              value={formData.screScore || ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="성적"
            />
          </Form.Group>
          <Form.Group sm="2" as={Col} controlId="formGridZip">
            <Form.Control
              name="mtcltnYr"
              value={formData.mtcltnYr}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="입학년도"
            />
          </Form.Group>
          <Form.Group sm="2" as={Col} controlId="formGridZip">
            <Form.Control
              name="grdtnYr"
              value={formData.grdtnYr}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="졸업년도"
            />
          </Form.Group>
        </Row>
        <Row>
          <Col style={{ padding: "10px" }}>
            <Button type="submit" className="button-save">
              저장
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              className="button-reset"
            >
              초기화
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DetailAcbg;
