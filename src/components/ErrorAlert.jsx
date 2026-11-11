import React, { memo } from 'react';
import ErrorCircleIcon from '../assets/error-circle.svg?react';
import CloseXIcon from '../assets/close-x.svg?react';
import './ErrorAlert.scss';

function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="ErrorAlert">
      <div className="ErrorAlert__icon-box">
        <ErrorCircleIcon className="ErrorAlert__icon" />
      </div>
      <div className="ErrorAlert__body">
        <p className="ErrorAlert__title">Error</p>
        <p className="ErrorAlert__message">{message}</p>
      </div>
      <button onClick={onDismiss} className="ErrorAlert__dismiss">
        <CloseXIcon className="ErrorAlert__dismiss-icon" />
      </button>
    </div>
  );
}

export default memo(ErrorAlert);
