import { Table, Button, Col, Form, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { TbX } from "react-icons/tb";

const DetailFgggAblty = () => {
  const [fgggAblty, setFgggAblty] = useState([]);
  const reqCode = ["VTW032", "VTW033"]; //VTW032	외국어종류코드, VTW033	회화수준코드

  const [VTW032, setvtw029] = useState([]);
  const [VTW033, setvtw030] = useState([]);

  const initFrom = {
    pictrsLevelCd: "",
    indvdlId: "",
    athriTestNm: "",
    score: "",
    fgggKndCd: "",
    fgggAbltySn: "",
  };

  const [formData, setFormData] = useState(initFrom);

  useEffect(() => {
    axios
      .all([
        axios.get("/boot/fggAblty?indvdlId=VK1545"), //학력 조회
        axios.get(`/boot/code?code=${reqCode}`),
      ])
      .then(
        axios.spread((response1, response2) => {
          setFgggAblty(response1.data);
          setvtw029(getLabelFromCode(response2.data.VTW032));
          setvtw030(getLabelFromCode(response2.data.VTW033));
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

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const saveConfirmed = window.confirm("저장 하시겠습니까?");

    if (!saveConfirmed) {
      return;
    }
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
            setFgggAblty(response1.data);
          })
          .catch((errors) => {
            console.log(errors);
          });
        setFormData(initFrom);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  const handleReset = () => {
    setFormData(initFrom);
  };

  // 테이블 행 클릭 시 해당 데이터를 폼에 빌드하는 함수
  const handleTableRowClick = (item) => {
    if (item && Object.values(item).length > 0) {
      setFormData(item);
    }
  };

  //삭제 함수
  const onDelClick = (index) => {
    const userConfirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (!userConfirmed) {
      return;
    }
    const itemToDelete = fgggAblty[index];
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
          .get("/boot/fggAblty?indvdlId=VK1545")
          .then((response1) => {
            setFgggAblty(response1.data);
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
              <th>외국어</th>
              <th>회화수준</th>
              <th>공인시험</th>
              <th>점수(등급)</th>
            </tr>
          </thead>
          <tbody>
            {fgggAblty.map((item, index) => (
              <tr key={index} onClick={() => handleTableRowClick(item)}>
                <td>
                  <Button variant="outline" onClick={() => onDelClick(index)}>
                    <TbX className="tbx" />
                  </Button>{" "}
                  {item.fgggKndCd}
                </td>
                <td>{item.pictrsLevelCd}</td>
                <td>{item.athriTestNm}</td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Form className="form-container" onSubmit={handleSubmit}>
        <h4>학력을 입력/수정합니다.</h4>
        <Row className="mb-3">
          <Form.Group sm="2" as={Col} controlId="formGridState">
            <Form.Select
              name="fgggKndCd"
              value={formData.fgggKndCd}
              onChange={handleInputChange}
            >
              <option value="">[ 외국어 ]</option>
              {Object.entries(VTW032).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group sm="3" as={Col} controlId="formGridState">
            <Form.Select
              name="pictrsLevelCd"
              value={formData.pictrsLevelCd}
              onChange={handleInputChange}
            >
              <option value="">[ 회화능력 ]</option>
              {Object.entries(VTW033).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group sm="3" as={Col} controlId="formGridCity">
            <Form.Control
              name="athriTestNm"
              value={formData.athriTestNm || ""}
              placeholder="공인시험명"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group
            sm="3"
            as={Col}
            controlId="formGridZip"
            style={{ flex: "1", marginRight: "10px" }}
          >
            <Form.Control
              name="score"
              value={formData.score || ""}
              placeholder="점수"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>
        <Button type="submit" className="button-save">
          저장
        </Button>
        <Button type="button" onClick={handleReset} className="button-reset">
          초기화
        </Button>
      </Form>
    </div>
  );
};

export default DetailFgggAblty;
