import React from "react";

import NewletterForm from "./Form";

const Home = () => {
  return (
    <div className="container">
      <div className="news-main">
        <div className="News-head">
          <h1>Create Newsletter</h1>
        </div>
        <NewletterForm />
      </div>
    </div>
  );
};

export default Home;
