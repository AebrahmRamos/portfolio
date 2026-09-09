import React from 'react';
import './Loading.css';

// Route-neutral: this fallback also covers /blog and /admin, where "Loading
// Portfolio..." was simply wrong. Renders a quiet placeholder rather than a
// spinner plus label, so a fast chunk load does not flash a message.
const Loading = () => (
  <div className="loading" role="status" aria-live="polite">
    <span className="loading__bar" aria-hidden="true" />
    <span className="loading__sr">Loading</span>
  </div>
);

export default Loading;
