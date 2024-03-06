import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Select } from "antd";
import { useRouter } from "next/router";

import Image from "next/image";

import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });

import axios from "axios";

export default function Home() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [menubrand, setMenuBrand] = useState([]);
  const [menuname, setMenuName] = useState([]);
  const [menuyear, setMenuYear] = useState([]);
  const [alldata, setAlldata] = useState([]);


  const [checkbrand, setcheckbrand] = useState(true);
  const [checkname, setcheckname] = useState(true);
  const [gonext, setgonext] = useState(true);

  const [namekeep, setnamekeep] = useState(null);
  const [yearkeep, setyearkeep] = useState(null);
  const [brandkeep, setbrandkeep] = useState(null);

  const [yearlist, setyearlist] = useState([]);

  const [datashow, setdatashow] = useState([]);

  const router = useRouter();


  const handleCarClick = (carIndex) => {
    setSelectedCar(datashow[carIndex]);
  };


  useEffect(() => {
    fetchDatacar()
    console.log(1)
  }, []);

  useEffect(() => {
    setSelectedCar(datashow[0]);
  }, [datashow])


  const fetchDatacar = async () => {
    try {
      const apiUrl = 'https://35.175.230.48/getallcar';
      const response = await axios.get(apiUrl);
      const data = response.data
      const yearArray = [];
      const datasort = Array.from(new Set(data.map(item => item.year)));
      const datasortnext = datasort.slice().sort((a, b) => b - a);

      const datashow = data.slice().sort((a, b) => b.year - a.year).slice(0, 5);
      setdatashow(datashow)

      datasortnext.forEach((item, index) => {
        yearArray.push({ label: item, value: item });
      });
      console.log(datashow)
      setMenuYear(yearArray);
      setAlldata(data)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onChangeY = (value, option) => {
    if (option == undefined) {
      setcheckbrand(true)
      setcheckname(true)
      setnamekeep(null)
      setbrandkeep(null)
      setgonext(true)
      setyearkeep(null)
    }
    else {
      setcheckbrand(false)
      const filteredData = alldata.filter(item => item.year === option.label);
      const brandarray = [];
      filteredData.forEach((item, index) => {
        brandarray.push({ label: item.brand, value: index });
      });
      setyearlist(filteredData)
      setyearkeep(option.label)
      setMenuBrand(brandarray)
    }
  };

  const onChangeB = (value, option) => {
    if (option == undefined) {
      setcheckname(true)
      setnamekeep(null)
      setbrandkeep(null)
      setgonext(true)

    }
    else {
      setcheckname(false)
      const filteredData = yearlist.filter(item => item.brand === option.label);
      const namearray = [];
      console.log(filteredData)
      setbrandkeep(option.label)

      filteredData.forEach((item, index) => {
        namearray.push({ label: item.name, value: index });
      });
      setMenuName(namearray)
    }
  };

  const onChange = (value, option) => {
    if (option == undefined) {
      setnamekeep(null)
      setgonext(true)

    }
    else {
      setnamekeep(option.label)
      setgonext(false)
    }
  };

  const gonextpage = async () => {
    router.push({
      pathname: '/Catalog',
      query: {
        year: yearkeep,
        brand: brandkeep,
        name: namekeep
      },
    });
  }

  return (
    <>
      <Navbar />

      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "7%"
        }}
      >

        <div
          className={myFont.className}
          style={{
            marginTop: 70,
            padding: 20,
            width: "80%",
            height: 380,
            fontSize: "20px",
            position: "relative",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            {selectedCar ? selectedCar.brand + " " + selectedCar.name + " " + selectedCar.year : null}
          </div>
          <div
            style={{
              margin: 20,
              fontSize: "20px",
            }}
          >
            {selectedCar ? selectedCar.desc : null}
          </div>

          {datashow.map((car, index) => (
            <h2
              key={index}
              className={myFont.className}
              style={{
                position: "fixed",
                fontSize: 16,
                left: 150,
                top: 140 + index * 50,
                cursor: "pointer",
                color: selectedCar === car ? "blue" : "black",
                borderBottom: index < datashow.length ? "1px solid gray" : "none", // เพิ่มบรรทัดนี้

              }}
              onClick={() => handleCarClick(index)}
            >
              {car.brand}   {car.name}   {car.year}
            </h2>
          ))}
        </div>

        {selectedCar && (
          <Image
            src={selectedCar.car_image}
            width={600}
            height={400}
            style={{ marginTop: -180, marginLeft: 1000, zIndex: 999 }}
          />
        )}

        <h1
          className={myFont.className}
          style={{
            textAlign: "center",
            fontSize: 22,
            marginTop: -70,
            marginBottom: 20,
          }}
        >
          ค้นหารถยนต์ที่ต้องการ
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Space size={32}>

            <Select
              allowClear
              showSearch
              placeholder="เลือกปีที่ผลิตรถยนต์"
              optionFilterProp="children"
              style={{
                width: "200px",
                height: "50px",
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
              }}
              onChange={onChangeY}
              options={menuyear}
              placement={'topLeft'}
              value={yearkeep}

            />
            <Select
              allowClear
              placeholder="เลือกยี่ห้อของรถยนต์"
              optionFilterProp="children"
              style={{
                width: "200px",
                height: "50px",
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",

              }}
              disabled={checkbrand}
              onChange={onChangeB}
              options={menubrand}
              placement={'topLeft'}
              value={brandkeep}

            />
          </Space>

        </div>

        <div
          style={{
            marginTop: 20,
          }}
        >
          <Space size={32}>
            <Select
              allowClear
              showSearch
              placeholder="เลือกรุ่นของรถยนต์"
              optionFilterProp="children"
              style={{
                width: "200px",
                height: "50px",
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
              }}
              disabled={checkname}
              onChange={onChange}
              options={menuname}
              placement={'topLeft'}
              value={namekeep}

            />
            <Button
              style={{
                width: "200px",
                height: "50px",
                justifyContent: "space-between",
                alignItems: "center",

              }}
              disabled={gonext}
              onClick={() => gonextpage()}
            >
              <span className={myFont.className} style={{ fontSize: 18 }}>
                แสดงชิ้นส่วนรถยนต์
              </span>
            </Button>
          </Space>
        </div>

      </div>
      <br></br>
      <Footer />

    </>
  );
}
