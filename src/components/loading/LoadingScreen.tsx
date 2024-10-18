import React from 'react';
import './LoadingScreen.scss';

const LoadingScreen: React.FC<{
  show: boolean,
  transitionDuration?: number,
  opacity?: number,
  label?: string,
  showIconOnly?: boolean,
}> = function LoadingScreen({ show, transitionDuration, opacity, label, showIconOnly }) {
  if (!show) {
    return null;
  }
  if (showIconOnly === true) {
    return <LoadingIcon label={label} showIconOnly />;
  }
  return (
    <div className="loading-screen" style={{ transitionDuration: `${transitionDuration}ms`, opacity: opacity }}>
      <LoadingIcon showIconOnly={false} label={label} />
      <div className="loading-logo">
        <img src="/assets/images/fmlx-loading.png" alt="logo" />
      </div>
    </div>
  );
};

LoadingScreen.defaultProps = {
  label: undefined,
  showIconOnly: false,
  opacity: 1,
  transitionDuration: 100,
};

const LoadingIcon: React.FC<{ showIconOnly: boolean, label?: string }> = function LoadingIcon({ showIconOnly, label }) {
  const graySide = showIconOnly ? 'dark' : 'light';
  return (
    <div className="text-center w-100">
      <div className="loading-screen-item-container">
        <div className="loading-screen-item">
          <div className="loading-screen-item-default-10" />
          <div className={`loading-screen-item-${graySide}-20`} />
          <div className={`loading-screen-item-${graySide}-30`} />
        </div>
        <div className="loading-screen-item">
          <div className={`loading-screen-item-${graySide}-60`} />
          <div className={`loading-screen-item-${graySide}-50`} />
          <div className="loading-screen-item-default-40" />
        </div>
        <div className="loading-screen-item">
          <div className={`loading-screen-item-${graySide}-70`} />
          <div className={`loading-screen-item-${graySide}-80`} />
          <div className="loading-screen-item-default-90" />
        </div>
      </div>
      {
        label !== undefined &&
        (
          <h4 className="loading-label no-wrap text-center">
            {label}
          </h4>
        )
      }
    </div>
  );
};

LoadingIcon.defaultProps = {
  label: undefined,
};

export default LoadingScreen;
