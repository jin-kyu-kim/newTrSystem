import { Pagination, Row, Col, Form } from "react-bootstrap";

const CustomPagination = ({
  currentPage,
  totalPages,
  onChgPage,
  onSelectChg,
}) => {
  const handlePrevClick = (e) => {
    if (e.target.innerHTML === "‹" || e.target.name === "prev") {
      console.log(currentPage);
      onChgPage(currentPage - 1);
    } else if (e.target.innerHTML === "›" || e.target.name === "next") {
      onChgPage(currentPage + 1);
    } else {
      onChgPage(e.target.name);
    }
  };

  return (
    <Row>
      <Col md={4}>
        <Pagination className="justify-content-md-center">
          <Pagination.Prev
            onClick={handlePrevClick}
            disabled={currentPage === 1}
            name="prev"
          />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 == currentPage}
              onClick={handlePrevClick}
              name={page + 1}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={handlePrevClick}
            disabled={currentPage === totalPages}
            name="next"
          />
        </Pagination>
      </Col>
      <Col md={{ span: 4, offset: 4 }}>
        <Form.Select onChange={onSelectChg}>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="80">80</option>
          <option value="100">100</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default CustomPagination;
