import SelectBox from "devextreme-react/cjs/select-box";
import Button from "devextreme-react/button"

const CustomPagination = ({
  currentPage,
  totalPages,
  onChgPage,
  onSelectChg,
  pageSize,
}) => {
  return (
    <div className="wrap_pagenation">
      <div style={{display: 'inline-block', justifyContent: 'space-between', alignItems: 'center'}}>
        <Button
          onClick={() => onChgPage(currentPage - 1)}
          disabled={currentPage === 1}
          name="prev"
          >
          Prev
        </Button>
        {[...Array(totalPages).keys()].map((page) => (
          <Button
          key={page + 1}
          onClick={() => onChgPage(page + 1)}
          disabled={page + 1 === currentPage}
          name={page + 1}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          onClick={() => onChgPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          name="next"
          >
          Next
        </Button>
      </div>
      <div style={{display: 'inline-block', justifyContent: 'space-between', alignItems: 'right'}}>
        <SelectBox
          dataSource={[20, 50, 80, 100]}
          value={pageSize}
          onValueChanged={onSelectChg}
        />
      </div>
    </div>
  );
};

export default CustomPagination;
