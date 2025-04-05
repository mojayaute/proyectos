import React from 'react';
import type { LoadingErrorProps } from "../../interfaces/types";
import './LoadingError.scss';

const LoadingError: React.FC<LoadingErrorProps> = ({ message, isError }) => {
  return isError ? <p className="error">{message}</p> : <p>{message}</p>;
};

export default LoadingError;
