import React, { useState } from "react";
import { Drawer, Space, Menu } from "antd";
import Image from "next/image";
import drawericon from "../../img/drawericon.png";
import logocar from "../../img/logocar.png";
import { useRouter } from "next/router";

import localFont from "next/font/local";
const myFont = localFont({ src: "../../fonts/ThursdayThin.ttf" });

function getItem(label, key, children, type) {
  return {
    key,
    children,
    label,
    type,
  };
}

const items = [
  getItem("จัดการข้อมูลทั่วไป", "sub1", [
    getItem("จัดการอะไหล่รถยนต์", "1"),

    getItem("จัดการรถยนต์", "2"),
  ]),
  getItem("จัดการการเทรนโมเดล", "sub2", [getItem("จัดการรูปภาพรถยนต์", "3")]),
];

const Drawers = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onClick = (e) => {

    if (e.key == 1) {
      router.push({
        pathname: '/Tablepart',
      })
    }
    else if (e.key == 2) {
      router.push({
        pathname: '/Carmanager',
      })
    }
    else {
      router.push({
        pathname: '/carimagemanager',
      })
    }
  };
  return (
    <>
      <Space>
        <Image
          src={drawericon}
          width={40}
          value={placement}
          onClick={showDrawer}
          style={{ cursor: "pointer" }}
        />
      </Space>
      <Drawer
        closable={true}
        title={
          <h2
            className={myFont.className}
            style={{
              textAlign: "center",
              fontSize: 24,
              marginLeft: -50,
              marginTop: 30,
            }}
          >
            รายการ
          </h2>
        }
        placement={placement}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <a href="/">
          <div
            style={{ display: "flex", alignItems: "center", marginTop: -50 }}
          >
            <Image src={logocar} width={200} />
            <span
              className={myFont.className}
              style={{ color: "black", fontSize: 24, marginLeft: -50 }}
            >
              Carnan
            </span>
          </div>
        </a>
        <Menu
          className={myFont.className}
          onClick={onClick}
          style={{
            width: 330,
            fontSize: 18,
          }}
          mode="inline"
          items={items}
        />
      </Drawer>
    </>
  );
};
export default Drawers;
