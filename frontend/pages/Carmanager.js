import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import {
  Layout,
  Button,
  Table,
  Spin,
  Typography,
  Modal,
  Popconfirm,
  Input,
  Space,
  Upload,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";

const { Content } = Layout;
import Highlighter from "react-highlight-words";
import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });
import {
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  CarOutlined,
} from "@ant-design/icons";
import axios from "axios";

import Image from "next/image";
import iconpart from "../img/iconcarpart.png";

const carimagemanager = () => {
  const router = useRouter();

  const { TextArea } = Input;
  const [loading, setLoading] = useState(true);
  const [waitadd, setWaitAdd] = useState(false);

  const [showContent, setShowContent] = useState(false);
  const [add, setAdd] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [newb, setNewb] = useState("");
  const [newy, setNewy] = useState(null);
  const [newn, setNewn] = useState("");
  const [newd, setNewd] = useState("");
  const [fileList, setFileList] = useState([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      await fetchDatacar();
      loadpage();
    };

    fetchData();
  }, []);

  const loadpage = () => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 400);

    return () => clearTimeout(timeout);
  };

  const fetchDatacar = async () => {
    try {
      const apiUrl = "https://54.173.229.99/cardataadmin";
      const response = await axios.get(apiUrl);
      setDataSource(response.data);
      console.log(dataSource);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters();
    setSearchText("");
    confirm();
    setSearchedColumn(dataIndex);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="default"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          fontSize: 20,
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: (
        <h2 className={myFont.className} style={{ fontSize: 20 }}>
          ยี่ห้อรถยนต์
        </h2>
      ),
      dataIndex: "brand",
      ...getColumnSearchProps("brand"),
      width: 250,
    },
    {
      title: (
        <h2 className={myFont.className} style={{ fontSize: 20 }}>
          รุ่นรถยนต์
        </h2>
      ),
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      width: 250,
    },
    {
      title: (
        <h2 className={myFont.className} style={{ fontSize: 20 }}>
          ปีที่ผลิต
        </h2>
      ),
      dataIndex: "year",
      key: "year",
      width: 200,
      sorter: (a, b) => a.year - b.year,
      showSorterTooltip: false,
    },

    {
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Space size={"large"}>
            <Tooltip
              placement="top"
              title={"จัดการอะไหล่รถยนต์ "}
              overlayStyle={{ fontFamily: "ThursdayThin" }}
            >
              <Typography.Link
                style={{ fontSize: 20 }}
                onClick={() => Nexttablecarpart(record)}
              >
                <Image src={iconpart} width={25} className="blue-icon" />
              </Typography.Link>
            </Tooltip>
            <Tooltip
              placement="top"
              title={"ลบข้อมูลรถยนต์"}
              overlayStyle={{ fontFamily: "ThursdayThin" }}
            >
              <Popconfirm
                title={
                  <span className="custom-popconfirm">คุณต้องการจะลบ?</span>
                }
                okType="default"
                cancelText={
                  <span className="custom-cancel-button">ยกเลิก</span>
                }
                okText={<span className="custom-ok-button">ตกลง</span>}
                onConfirm={() => handleDelete(record)}
                style={{ fontSize: 16 }}
              >
                <Typography.Link style={{ fontSize: 20 }}>
                  <DeleteOutlined />{" "}
                </Typography.Link>
              </Popconfirm>
            </Tooltip>
          </Space>
        ) : null,

      width: 200,
    },
  ];
  const Nexttablecarpart = async (key) => {
    console.log(key);
    router.push({
      pathname: "/TableCarPart",
      query: {
        requestyear: key.year,
        requestbrand: key.brand,
        requestname: key.name,
        pagetmp: "tmp-0",
      },
    });
  };

  const handleDelete = async (key) => {
    const newData = dataSource.filter((item) => item._id !== key._id);
    const apiUrl = "https://54.173.229.99/dropcar";
    const requestData = {
      delid: key._id,
    };
    try {
      await axios.put(apiUrl, requestData);
    } catch (error) {
      console.error("Error:", error.response);
    }
    setDataSource(newData);
  };

  const YearNew = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue)) {
      setNewy(inputValue);
    }
  };
  const BrandNew = (e) => {
    const { value: inputValue } = e.target;
    setNewb(inputValue);
  };
  const NameNew = (e) => {
    const { value: inputValue } = e.target;
    setNewn(inputValue);
  };
  const Newdesc = (e) => {
    const { value: inputValue } = e.target;
    setNewd(inputValue);
  };
  const propsimage = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };
  const Addnewcar = async () => {
    const apiUrl = "https://54.173.229.99/addcar";
    if (
      newn == "" ||
      newb == "" ||
      newd == "" ||
      newy == "" ||
      fileList.length == 0
    ) {
      alert("โปรดกรอกข้อมูลให้ครบ");
      return;
    }
    const file = fileList[0];
    setWaitAdd(true);
    const formData = new FormData();
    formData.append("file", file); // ใช้ file.originFileObj
    formData.append("name", newn);
    formData.append("brand", newb);
    formData.append("year", newy);
    formData.append("desc", newd);

    const maxId = Math.max(...dataSource.map((item) => item._id));
    const NewData = {
      _id: maxId + 1,
      name: newn,
      brand: newb,
      year: newy,
      desc: newd,
      file: fileList[0],
    };
    setDataSource((prevDataSource) => [...prevDataSource, NewData]);
    try {
      await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewb("");
      setNewn("");
      setNewd("");
      setNewy("");
      setFileList([]);
      setWaitAdd(false);
      setAdd(false);
      alert("เพิ่มข้อมูลรถยนต์สำเร็จ");
    } catch (error) {
      setNewb("");
      setNewn("");
      setNewd("");
      setNewy("");
      setFileList([]);
      setWaitAdd(false);
      setAdd(false);
      alert("เพิ่มข้อมูลรถยนต์ไม่สำเร็จ");
      console.error("Error:", error.response);
    }
  };

  return (
    <Spin
      spinning={loading}
      tip="กำลังโหลดข้อมูลรถยนค์..."
      style={{ marginTop: "20%" }}
    >
      <>
        <Navbar />
        {showContent && (
          <Layout>
            <Layout>
              <Content
                className={myFont.className}
                style={{
                  padding: 50,
                  minHeight: "100vh",
                  backgroundColor: "white",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                <>
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    จัดการข้อมูลรถยนต์
                  </div>
                  <br></br>
                  <button
                    class="focus:[#1677ff] bg-[#1670ff] hover:bg-[#14ff] font-bold px-5 py-2 rounded-lg"
                    style={{
                      margin: 20,
                      fontSize: 18,
                      color: "white",
                      fontWeight: "normal",
                    }}
                    onClick={() => setAdd(true)}
                  >
                    เพิ่มรถยนต์
                  </button>

                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      pageSize: 7,
                      showSizeChanger: false,
                    }}
                  />
                </>
              </Content>
            </Layout>
            <Modal
              className={myFont.className}
              title="เพิ่มข้อมูลรถยนต์"
              open={add}
              onOk={() => Addnewcar()}
              onCancel={() => {
                setAdd(false),
                  setFileList([]),
                  setNewb(""),
                  setNewy(""),
                  setNewn(""),
                  setNewd("");
              }}
              okText={<span className="custom-ok-button">เพิ่มข้อมูล</span>}
              cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
              okType="default"
            >
              <Spin spinning={waitadd} tip="กำลังเพิ่มข้อมูลรถยนต์">
                <Tooltip
                  placement="topLeft"
                  title={"กรอกรุ่นรถยนต์"}
                  className={myFont.className}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Input
                    placeholder="รุ่นรถยนต์"
                    className="mb-3 mt-3"
                    onChange={NameNew}
                    value={newn}
                  />
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={"กรอกยึ่ห้อรถยนต์"}
                  className={myFont.className}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Input
                    placeholder="ยี่ห้อรถยนต์"
                    className="mb-3"
                    onChange={BrandNew}
                    value={newb}
                  />
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={"กรอกปีที่ผลิตรถยนต์"}
                  className={myFont.className}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Input
                    placeholder="ปีที่ผลิต"
                    className="mb-3"
                    value={newy}
                    onChange={YearNew}
                  />
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={"อัปโหลดรูปภาพตัวอย่างรถยนต์"}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Upload {...propsimage} className="mb-3" maxCount={1}>
                    <Button
                      icon={<UploadOutlined />}
                      className={myFont.className}
                    >
                      อัปโหลดรูปภาพรถยนต์
                    </Button>
                  </Upload>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={"กรอกรายละเอียดของรถยนต์"}
                  className={myFont.className}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <TextArea
                    rows={4}
                    placeholder="ข้อมูลรถยนต์"
                    className="mt-3 mb-3"
                    onChange={Newdesc}
                    value={newd}
                  />
                </Tooltip>
              </Spin>
            </Modal>
          </Layout>
        )}

        <Footer />
      </>
    </Spin>
  );
};

export default carimagemanager;
//
