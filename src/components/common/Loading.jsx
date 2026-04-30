import React from 'react';
import { Progress } from '../m3';
import './Loading.css';

const Loading = () => (
  <div className="loading">
    <Progress size={60} />
    <p className="m3-title-medium loading__text">Loading Portfolio...</p>
  </div>
);

export default Loading;
