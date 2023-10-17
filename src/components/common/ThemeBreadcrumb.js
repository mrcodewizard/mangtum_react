import React from "react";

const ThemeBreadcrumb = ({ title, current_route }) => {
  return (
    <div className="page-title">
      <div className="breadcrumb-head container">
        <h3 className="page-title-heading d-none d-sm-block">{title}</h3>
        <nav className="breadcrumb-wrap">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item " aria-current="page">
              <span className="breadcrumb_active text-capitalize">
                {current_route}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ThemeBreadcrumb;
