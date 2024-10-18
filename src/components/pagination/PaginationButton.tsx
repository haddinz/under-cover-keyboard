import React from 'react';

const PaginationButton: React.FC<{
  activePage: number,
  totalData: number,
  limit: number,
  onClick: (page: number) => any,
}> = function PaginationButton({ activePage, totalData, limit, onClick: propsOnClick }) {
  const buttonIndexes = generateButtonValues(limit, totalData, activePage);
  if (buttonIndexes.length === 0) {
    return null;
  }
  return (
    <nav className="nav-pagination">
      <ul className="pagination">
        {/* <li className="page-item">
            <button type="button" className="page-link clickable" onClick={(e) => onClick(previusPage)}>
              Previous
            </button>
          </li> */}
        {buttonIndexes.map((page, i) => {
          const isSeparator = typeof page === 'string';
          const isActive = !isSeparator && (page - 1 === activePage);
          const className = `page-item ${(isActive ? 'active' : '')}`;
          const onClick = () => {
            if (!isSeparator) {
              propsOnClick(page - 1);
            }
          };
          const key = `pagination-${page}-${i}`;
          return (
            <li key={key} className={className}>
              <button type="button" className="page-link clickable" onClick={onClick}>
                {page}
              </button>
            </li>
          );
        })}
        {/* <li className="page-item">
            <button type="button" className="page-link clickable" onClick={(e) => onClick(nextPage)}>
              Next
            </button>
          </li> */}
      </ul>
    </nav>

  );
};
const SEPARATOR = '...';
const generateButtonValues = (limit: number, totalData: number, currentPage: number) => {
  /* DISPLAYED BUTTONS */
  const displayedButtons: any[] = [];
  const buttonCount = Math.ceil(totalData / limit);
  const min = (currentPage) - 1;
  const max = (currentPage) + 3;

  if (buttonCount > 1) {
    displayedButtons.push(1);
    if (min > 2) {
      displayedButtons.push(2);
    }
    if (min > 3) {
      displayedButtons.push(3);
    }
  }
  if (min > 5) {
    displayedButtons.push(SEPARATOR);
  }
  for (let i = min; i <= max; i += 1) {
    if (i > 1 && i <= buttonCount) {
      displayedButtons.push(i);
    }
  }
  if (max < buttonCount - 4) {
    displayedButtons.push(SEPARATOR);
  }
  if (max < buttonCount) {
    if (max < buttonCount - 2) {
      displayedButtons.push(buttonCount - 2);
    }
    if (max < buttonCount - 1) {
      displayedButtons.push(buttonCount - 1);
    }
    displayedButtons.push(buttonCount);
  }
  return displayedButtons;
};

export default PaginationButton;
