import SelectBox from "devextreme-react/cjs/select-box";

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
        <button
          onClick={() => onChgPage(currentPage - 1)}
          disabled={currentPage === 1}
          name="prev"
          >
          Prev
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
          key={page + 1}
          onClick={() => onChgPage(page + 1)}
          disabled={page + 1 === currentPage}
          name={page + 1}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => onChgPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          name="next"
          >
          Next
        </button>
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
