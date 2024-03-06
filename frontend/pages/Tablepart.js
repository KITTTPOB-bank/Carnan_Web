import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import {
  Layout,
  Menu,
  Table,
  Spin,
  Typography,
  Modal,
  Button,
  Popconfirm,
  Tooltip,
  Input,
  Space,
  Upload,
  Alert,
} from "antd";
const { Content, Sider } = Layout;
import axios from "axios";
import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });
import {
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const Tablepart = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const dataFetchedRef = useRef(false);

  const [add, setAdd] = useState(false);
  const [upload, setUpload] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [alldataSource, setallDataSource] = useState([]);
  const [namepartcar, setNamepartcar] = useState("กันชนหน้า");

  const [typesend, settypesend] = useState(0);
  const [price_new, setPriceNew] = useState("");
  const [code_new, setCodeNew] = useState("");
  const [name_new, setNameNew] = useState("");

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [checkfile, setCheckFile] = useState(false);
  const [checktype, setCheckType] = useState(false);
  const [success, setSuccess] = useState(false);

  //ค้นหารถยนต์
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      await fetchDatapart();
      loadpage();
      console.log(2);
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

  const handleUpload = async () => {
    console.log(checktype);
    if (fileList.length === 0) {
      setCheckFile(true);
      setCheckType(false);
      setSuccess(false);

      return;
    }
    const file = fileList[0];
    if (file.type !== "application/json") {
      setCheckType(true);
      setCheckFile(false);
      setSuccess(false);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    await axios
      .post(`https://35.175.230.48/jsonfile?typecheck=${typesend}`, formData)
      .then((response) => {
        console.log("Upload successful", response.data);
      })
      .catch((error) => {
        console.error("Error uploading file", error);
      });
    setCheckFile(false);
    setCheckType(false);
    setLoading(true);
    setSuccess(true);
    setShowContent(false);
    await fetchDatapart();
    performAction();
  };

  const performAction = () => {
    console.log("performAction is called!");
    const timeout = setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timeout);
  };
  const handleCancel = () => {
    setFileList([]);
    setUploading(false);
    setCheckFile(false);
    setCheckType(false);
    setSuccess(false);
    setUpload(false);
  };

  const props = {
    onRemove: () => {
      setFileList([]);
      setCheckType(false);
      setCheckFile(false);
      setSuccess(false);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const Newprice = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === ".") {
      setPriceNew(inputValue);
    }
  };
  const Newcode = (e) => {
    const { value: inputValue } = e.target;
    setCodeNew(inputValue);
  };
  const Newname = (e) => {
    const { value: inputValue } = e.target;
    setNameNew(inputValue);
  };
  const Editprice = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === ".") {
      setPriceEdit(inputValue);
    }
  };
  const Editcode = (e) => {
    const { value: inputValue } = e.target;
    setCodeeEdit(inputValue);
  };
  const Editname = (e) => {
    const { value: inputValue } = e.target;
    setNameeEdit(inputValue);
  };

  const fetchDatapart = async () => {
    try {
      const apiUrl = "https://35.175.230.48/carpartall";
      const response = await axios.get(apiUrl);
      setallDataSource(response.data);
      setDataSource(response.data.all_frontbumper);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sideritem = [
    {
      label: "กันชนหน้า",
    },
    {
      label: "กันชนหลัง",
    },
    {
      label: "กระจังหน้า",
    },
    {
      label: "กระจกข้าง",
    },
    {
      label: "ไฟหน้า",
    },
    {
      label: "ไฟท้าย",
    },
    {
      label: "ประตู",
    },
  ];

  // ค้นหา
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
          รหัสอะไหล่
        </h2>
      ),
      dataIndex: "code",
      ...getColumnSearchProps("code"),

      key: "code",
      render: (code) => (
        <h2 className={myFont.className} style={{ fontSize: 16 }}>
          {code}
        </h2>
      ),
      width: 100,
    },
    {
      title: (
        <h2 className={myFont.className} style={{ fontSize: 20 }}>
          ชื่ออะไหล่
        </h2>
      ),
      dataIndex: "name",
      ...getColumnSearchProps("name"),

      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <h2 className={myFont.className} style={{ fontSize: 16 }}>
          {name}
        </h2>
      ),
      width: 150,
    },
    {
      title: (
        <h2 className={myFont.className} style={{ fontSize: 20 }}>
          ราคา (บาท)
        </h2>
      ),
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <h2 className={myFont.className} style={{ fontSize: 16 }}>
          {price === "0" || price === 0 ? "ไม่มีสำหรับการขาย" : price}
        </h2>
      ),
      width: 100,
      sorter: (a, b) => a.price - b.price,
      showSorterTooltip: false,
    },

    {
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title={<span className="custom-popconfirm">คุณต้องการจะลบ?</span>}
            okType="default"
            cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
            okText={<span className="custom-ok-button">ตกลง</span>}
            onConfirm={() => handleDelete(record._id)}
          >
            <Typography.Link style={{ fontSize: 20 }}>
              <Tooltip
                placement="top"
                title={"ลบอะไหล่"}
                overlayStyle={{ fontFamily: "ThursdayThin" }}
              >
                <DeleteOutlined />{" "}
              </Tooltip>
            </Typography.Link>
          </Popconfirm>
        ) : null,
      width: 100,
    },
  ];

  const handleDelete = async (id) => {
    const apiUrl = "https://35.175.230.48/deleteallpart";
    const requestData = {
      delid: id,
      type: typesend,
    };
    try {
      await axios.put(apiUrl, requestData);
    } catch (error) {
      console.error("Error:", error.response);
    }

    const updateData = (type, allDataSource) => {
      const newData = dataSource.filter((item) => item._id !== id);
      const newOptions = allDataSource[`all_${type}`].filter(
        (item) => item._id !== id
      );
      setallDataSource({
        ...allDataSource,
        [`all_${type}`]: newOptions,
      });
      setDataSource(newData);
    };
    switch (typesend) {
      case 0:
        updateData("frontbumper", alldataSource);
        break;
      case 1:
        updateData("rearbumper", alldataSource);
        break;
      case 2:
        updateData("grille", alldataSource);
        break;
      case 3:
        updateData("mirror", alldataSource);
        break;
      case 4:
        updateData("headlamp", alldataSource);
        break;
      case 5:
        updateData("backuplamp", alldataSource);
        break;
      case 6:
        updateData("door", alldataSource);
        break;
      default:
        break;
    }
  };

  const AddNewData = async () => {
    const apiUrl = "https://35.175.230.48/addallpart";
    const requestData = {
      name: name_new,
      code: code_new,
      price: price_new,
      type: typesend,
    };
    try {
      await axios.put(apiUrl, requestData);
      updatedata("add");
    } catch (error) {
      console.error("Error:", error.response);
    }
    setAdd(false);
  };

  const Editpartdata = async () => {
    console.log(editValue);
    const apiUrl = "https://35.175.230.48/editallpart";
    const requestData = {
      name: name_edit,
      code: code_edit,
      price: price_edit,
      type: typesend,
      oldid: editValue,
    };
    try {
      await axios.put(apiUrl, requestData);
      updatedata("edit");
    } catch (error) {
      console.error("Error:", error.response);
    }
    setAdd(false);
  };

  //อัปเดทข้อมูล
  const updatedata = async (worktype) => {
    const updateData = (type, allDataSource, worktype) => {
      if (worktype == "add") {
        const maxId = Math.max(...dataSource.map((item) => item._id));
        const NewData = {
          _id: maxId + 1,
          name: name_new,
          code: code_new,
          price: price_new,
        };
        setDataSource((prevDataSource) => [...prevDataSource, NewData]);
        allDataSource[`all_${type}`].push(NewData);
        setNameNew("");
        setCodeNew("");
        setPriceNew(0);
        setAdd(false);
      } else if (worktype == "edit") {
        const newData = dataSource.map((item) => {
          if (item._id === editValue) {
            return {
              _id: editValue,
              name: name_edit,
              code: code_edit,
              price: price_edit,
            };
          }
          return item;
        });
        const newOptions = allDataSource[`all_${type}`].map((item) => {
          if (item._id === editValue) {
            return {
              _id: editValue,
              name: name_edit,
              code: code_edit,
              price: price_edit,
            };
          }
          return item;
        });
        setallDataSource({
          ...allDataSource,
          [`all_${type}`]: newOptions,
        });
        setDataSource(newData);

        setNameeEdit("");
        setCodeeEdit("");
        setPriceEdit(0);
        setEdit(false);
      }
    };
    switch (typesend) {
      case 0:
        updateData("frontbumper", alldataSource, worktype);
        break;
      case 1:
        updateData("rearbumper", alldataSource, worktype);
        break;
      case 2:
        updateData("grille", alldataSource, worktype);
        break;
      case 3:
        updateData("mirror", alldataSource, worktype);
        break;
      case 4:
        updateData("headlamp", alldataSource, worktype);
        break;
      case 5:
        updateData("backuplamp", alldataSource, worktype);
        break;
      case 6:
        updateData("door", alldataSource, worktype);
        break;
      default:
        break;
    }
  };

  const onClick = (e) => {
    const numberAfterHyphen = parseInt(e.key.split("-")[1], 10);
    switch (numberAfterHyphen) {
      case 0:
        setNamepartcar("กันชนหน้า");
        setDataSource(alldataSource.all_frontbumper);
        settypesend(0);
        break;
      case 1:
        setNamepartcar("กันชนหลัง");
        setDataSource(alldataSource.all_rearbumper);
        settypesend(1);
        break;
      case 2:
        setNamepartcar("กระจังหน้า");
        setDataSource(alldataSource.all_grille);
        settypesend(2);
        break;
      case 3:
        setNamepartcar("กระจกข้าง");
        setDataSource(alldataSource.all_mirror);
        settypesend(3);
        break;
      case 4:
        setNamepartcar("ไฟหน้า");
        setDataSource(alldataSource.all_headlamp);
        settypesend(4);
        break;
      case 5:
        setNamepartcar("ไฟท้าย");
        setDataSource(alldataSource.all_backuplamp);
        settypesend(5);
        break;
      case 6:
        setNamepartcar("ประตู");
        setDataSource(alldataSource.all_door);
        settypesend(6);
        break;
      default:
        break;
    }
  };

  return (
    <Spin
      spinning={loading}
      tip="กำลังโหลดอะไหล่ทั้งหมด..."
      style={{ marginTop: "20%" }}
    >
      <>
        <Navbar />
        {showContent && (
          <Layout>
            <Sider width={250}>
              <Menu
                style={{
                  height: "100%",
                  borderWidth: 1,
                  padding: 20,
                }}
              >
                <Menu
                  className={myFont.className}
                  style={{ width: 229, fontSize: 16 }}
                  defaultSelectedKeys={["tmp-0"]}
                  mode="inline"
                  items={sideritem}
                  onClick={onClick}
                />
              </Menu>
            </Sider>

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
                    อะไหล่ของ{namepartcar}
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
                    เพิ่มอะไหล่
                  </button>
                  <button
                    class="focus:[#1677ff] bg-[#1670ff] hover:bg-[#14ff] font-bold px-5 py-2 rounded-lg"
                    style={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: "normal",
                    }}
                    onClick={() => setUpload(true)}
                  >
                    อัปโหลดไฟล์อะไหล่
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
              title="อัปโหลดไฟล Json อะไหล่รถยนต์"
              centered
              open={upload}
              onOk={() => setUpload(handleUpload)}
              onCancel={handleCancel}
              okType="default"
              cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
              okText={<span className="custom-ok-button">อัปโหลด</span>}
            >
              <Tooltip
                placement="topLeft"
                title={
                  "อัปโหลดไฟล์ Json สำหรับเพิ่มข้อมูลอะไหล่ โดยมีข้อมูลดังนี้ code คือ รหัสอะไหล่ , name คือ ชื่ออะไหล่ , price คือ ราคาอะไหล่"
                }
                overlayStyle={{ fontFamily: "ThursdayThin" }}
              >
                <Upload {...props} maxCount={1}>
                  <Button
                    icon={<UploadOutlined />}
                    className={myFont.className}
                  >
                    เลือกอัปโหลด
                  </Button>
                </Upload>
              </Tooltip>
              {checkfile && (
                <Alert message="กรุณาเลือกไฟล์ที่จะอัปโหลด" type="error" />
              )}

              {checktype && (
                <Alert message="ไฟล์ที่อัปโหลดไม่ใช่ไฟล์ Json" type="error" />
              )}
              {success && <Alert message="อัปโหลดสำเร็จ" type="success" />}
            </Modal>
            <Modal
              className={myFont.className}
              title="เพิ่มอะไหล่ชิ้นส่วนรถยนต์"
              centered
              open={add}
              onOk={() => AddNewData()}
              onCancel={() => {
                setAdd(false), setCodeNew(""), setNameNew(""), setPriceNew("");
              }}
              okType="default"
              cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
              okText={<span className="custom-ok-button">เพิ่มข้อมูล</span>}
            >
              {" "}
              <Space direction="horizontal">
                <Tooltip
                  placement="topLeft"
                  title={"กรอกรหัสอะไหล่"}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Input
                    className={myFont.className}
                    placeholder="รหัสอะไหล่"
                    onChange={Newcode}
                    value={code_new}
                  />
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={"กรอกชื่ออะไหล่"}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Input
                    className={myFont.className}
                    placeholder="ชื่ออะไหล่"
                    onChange={Newname}
                    value={name_new}
                  />
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={
                    "กรอกราคาอะไหล่ เลข 0 จะแสดงผลเป็นข้อความ ไม่มีสำหรับการขาย"
                  }
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <Input
                    className={myFont.className}
                    placeholder="ราคาอะไหล่"
                    value={price_new}
                    onChange={Newprice}
                  />
                </Tooltip>
              </Space>
            </Modal>
          </Layout>
        )}

        <Footer />
      </>
    </Spin>
  );
};

export default Tablepart;
