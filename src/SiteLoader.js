import React from "react";
import { Circles } from "react-loader-spinner";

const SiteLoader = (props) => {
  return (
    <>
      {props.status ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Circles type="Circles" color="#f6a92c" height={100} width={100} />
        </div>
      ) : null}
    </>
  );
};

export default SiteLoader;
