import React from 'react';

const ExportingGraphLoading: React.FC = function ExportingGraphLoading() {
  return (
    <div className="pos-absolute bg-light w-100 flex-common" style={{ zIndex: 5, height: 250 }}>
      <span>Exporting Graph..</span>
    </div>
  );
};

export default ExportingGraphLoading;
