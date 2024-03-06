import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;
import localFont from 'next/font/local';
const myFont = localFont({ src: '../../fonts/ThursdayThin.ttf' })

const Footers = () => {
  return (
    <Layout className="layout">
      <Footer
        className={myFont.className}
        style={{
          borderTop: "1px solid #e8e8e8",
          left: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "#6078FA",
          color: "white",
          textAlign: "center",
          position: "fixed"
        }}
      >
        Copyright © 2023 All Rights Reserved

      </Footer>
    </Layout>
  );
};
export default Footers;
//