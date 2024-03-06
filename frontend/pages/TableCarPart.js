import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import {
  Layout,
  Menu,
  Button,
  Table,
  Spin,
  Typography,
  Modal,
  Select,
  Popconfirm,
  Tooltip,
  Input,
  Space,
  Upload,
  Alert,
} from "antd";
const { Content, Sider } = Layout;

import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });
import {
  EditFilled,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";

const TableCarPart = () => {
  // เปลี่ยนรุ่นรถยนต์
  const [carselect, setCarSelect] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [topic, setTopic] = useState("เลือกปีที่ผลิตของรถยนต์");
  const [years, setYears] = useState([]);
  const [brands, setBrands] = useState([]);
  const [names, setNames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // loading
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // เก็บข้อมูลทื่ได้จากดาต้าเบส
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [alldataSource, setallDataSource] = useState([]);
  const [namepartcar, setNamepartcar] = useState("กันชนหน้า");
  const [options, setOptions] = useState([]);
  const [typesend, settypesend] = useState(0);
  const dataFetchedRef = useRef(false);

  // เพิ่มอะไหล่
  const [listparts_add, setListParts_Add] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [namesave, setNameSave] = useState(null);
  const [brandsave, setBrandSave] = useState(null);
  const [yearsave, setYearSave] = useState(null);

  // แก้ไขอะไหล่
  const [editid, setEditId] = useState(null);
  const [edit_name, setEdit_Name] = useState(null);
  const [edit_price, setEdit_Price] = useState(null);
  const [edit_code, setEdit_code] = useState(null);

  const [old_editid, setOld_EditId] = useState(null);
  const [old_name, setOld_Name] = useState(null);
  const [old_price, setOld_Price] = useState(null);
  const [old_code, setOld_code] = useState(null);
  const [editidcheck, setEditidcheck] = useState(null);

  // รับค่าจากหน้าที่แล้ว
  const router = useRouter();
  const [tmpdata, setTmpData] = useState("tmp-0");
  const { requestyear, requestbrand, requestname, pagetmp, nametype } = router.query;

  // ค้นหารถยนต์
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  /////
  const [upload, setUpload] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [checkfile, setCheckFile] = useState(false);
  const [checktype, setCheckType] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("Admin") == undefined) {
      const isAdmin = false;
      setisAdmin(isAdmin);
    } else {
      const isAdmin = true;
      setisAdmin(isAdmin);
    }
    console.log(localStorage);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setNameSave(requestname);
      setBrandSave(requestbrand);
      setYearSave(requestyear);
      setTmpData(pagetmp);
      if (nametype != undefined) {
        setNamepartcar(nametype)
      }
      if (requestbrand || requestname || requestyear) {
        await fetchDatacar();
        await fetchDatapart();
        console.log(1);
        performAction();
        console.log(2);
      }
    };

    fetchData();
  }, [requestbrand, requestname, requestyear]);

  const performAction = () => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 400);

    return () => clearTimeout(timeout);
  };

  const fetchDatacar = async () => {
    try {
      const apiUrl = "http://34.235.119.235/cardata";
      const response = await axios.get(apiUrl);
      setCarSelect(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDatapart = async () => {
    try {
      const apiUrl = "http://34.235.119.235/carpart";
      const queryParams = {
        brand: requestbrand,
        name: requestname,
        year: requestyear,
        check: 1,
      };

      const response = await axios.get(apiUrl, {
        params: queryParams,
      });
      setallDataSource(response.data);

      const mapDataAndSetState = (data, type) => {
        const allData = data[`all_${type}`].map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));

        setOptions(allData);
        setDataSource(data[type]);
      };
      switch (pagetmp) {
        case "tmp-0":
          mapDataAndSetState(response.data, "frontbumper");
          break;
        case "tmp-1":
          mapDataAndSetState(response.data, "rearbumper");
          break;
        case "tmp-2":
          mapDataAndSetState(response.data, "grille");
          break;
        case "tmp-3":
          mapDataAndSetState(response.data, "mirror");
          break;
        case "tmp-4":
          mapDataAndSetState(response.data, "headlamp");
          break;
        case "tmp-5":
          mapDataAndSetState(response.data, "backuplamp");
          break;
        case "tmp-6":
          mapDataAndSetState(response.data, "door");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleUpload = async () => {
    console.log(checktype);
    console.log(namesave);
    console.log(yearsave);
    console.log(brandsave);
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
    formData.append("typecheck", typesend);
    formData.append("name", namesave);
    formData.append("brand", brandsave);
    formData.append("year", yearsave);
    formData.append("typecheck", typesend);

    await axios
      .post(`http://34.235.119.235/jsonfileaddcarpart`, formData)
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
  const handleCancelUpload = () => {
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

  // เพิ่มอะไหล่
  const handleChangeAdd = (value, option) => {
    setSelectedValues(value);
    const selectedIds = option.map((opt) => opt._id);
    setListParts_Add(selectedIds);
  };

  const Addsubmit = async () => {
    const apiUrl = "http://34.235.119.235/addpart";
    const requestData = {
      selected_ids: listparts_add,
      type: typesend,
      name: namesave,
      year: yearsave,
      brand: brandsave,
    };
    try {
      await axios.put(apiUrl, requestData);
      setSelectedValues([]);
      updatedata("add");
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };

  // แก้ไขอะไหล่
  const handleEdit = (record) => {
    setEditValue(record.code);
    setOld_EditId(record._id);
    setOld_Name(record.name);
    setOld_Price(record.price);
    setOld_code(record.code);
    setEdit(true);
  };

  const handleChangeEdit = (value, option) => {
    setEditValue(value);
    const id = option._id;
    const name = option.name;
    const price = option.price;
    setEditId(id);
    setEdit_Name(name);
    setEdit_Price(price);
    setEdit_code(value);
  };

  const Editsubmit = async () => {
    if (editid != editidcheck) {
      setEdit(false);
    }
    console.log(editid, old_editid);
    const apiUrl = "http://34.235.119.235/editpart";
    const requestData = {
      newid: editid,
      oldid: old_editid,
      type: typesend,
      name: namesave,
      year: yearsave,
      brand: brandsave,
    };
    try {
      await axios.put(apiUrl, requestData);
      updatedata("edit");
    } catch (error) {
      console.error("Error:", error.response);
    }
  };

  // ลบอะไหล่
  const handleDelete = async (record) => {
    const id = record._id;
    const name = record.name;
    const price = record.price;
    const code = record.code;
    const newItem = { _id: id, name: name, price: price, code: code };

    // ส่งข้อมูลการลบ
    const apiUrl = "http://34.235.119.235/deletepart";
    const requestData = {
      delid: id,
      type: typesend,
      name: namesave,
      year: yearsave,
      brand: brandsave,
    };
    try {
      await axios.put(apiUrl, requestData);
    } catch (error) {
      console.error("Error:", error.response);
    }

    // อัปเดทข้อมูลการลบ
    const updateData = (type, dataSource, allDataSource) => {
      const newData = dataSource.filter((item) => item._id !== id);
      const newOptions = [...allDataSource[`all_${type}`], newItem];
      setallDataSource({
        ...allDataSource,
        [type]: newData,
        [`all_${type}`]: newOptions,
      });
      setDataSource(newData);
      const options = newOptions.map((item) => ({
        label: item.code,
        value: item.code,
        _id: item._id,
        name: item.name,
        price: item.price,
      }));
      setOptions(options);
    };
    switch (typesend) {
      case 0:
        updateData("frontbumper", alldataSource.frontbumper, alldataSource);
        break;
      case 1:
        updateData("rearbumper", alldataSource.rearbumper, alldataSource);
        break;
      case 2:
        updateData("grille", alldataSource.grille, alldataSource);
        break;
      case 3:
        updateData("mirror", alldataSource.mirror, alldataSource);
        break;
      case 4:
        updateData("headlamp", alldataSource.headlamp, alldataSource);
        break;
      case 5:
        updateData("backuplamp", alldataSource.backuplamp, alldataSource);
        break;
      case 6:
        updateData("door", alldataSource.door, alldataSource);
        break;
      default:
        break;
    }
  };

  //อัปเดทข้อมูล
  const updatedata = async (worktype) => {
    const updateData = (type, dataSource, allDataSource, worktype) => {
      if (worktype == "add") {
        const newData = [
          ...dataSource,
          ...allDataSource[`all_${type}`].filter((item) =>
            listparts_add.includes(item._id)
          ),
        ];
        const newOptions = allDataSource[`all_${type}`].filter(
          (item) => !listparts_add.includes(item._id)
        );
        setallDataSource({
          ...allDataSource,
          [type]: newData,
          [`all_${type}`]: newOptions,
        });
        setDataSource(newData);
        const options = newOptions.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(options);
      } else if (worktype == "edit") {
        const newData = allDataSource[`${type}`].map((item) => {
          if (item._id === old_editid) {
            return {
              _id: editid,
              name: edit_name,
              code: edit_code,
              price: edit_price,
            };
          }
          return item;
        });
        const newOptions = allDataSource[`all_${type}`].map((item) => {
          if (item._id === editid) {
            return {
              _id: old_editid,
              name: old_name,
              code: old_code,
              price: old_price,
            };
          }
          return item;
        });
        setallDataSource({
          ...allDataSource,
          [type]: newData,
          [`all_${type}`]: newOptions,
        });
        setDataSource(newData);
        const options = newOptions.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setEditidcheck(editid);
        setOptions(options);
        setEdit(false);
      }
    };
    switch (typesend) {
      case 0:
        updateData(
          "frontbumper",
          alldataSource.frontbumper,
          alldataSource,
          worktype
        );
        break;
      case 1:
        updateData(
          "rearbumper",
          alldataSource.rearbumper,
          alldataSource,
          worktype
        );
        break;
      case 2:
        updateData("grille", alldataSource.grille, alldataSource, worktype);
        break;
      case 3:
        updateData("mirror", alldataSource.mirror, alldataSource, worktype);
        break;
      case 4:
        updateData("headlamp", alldataSource.headlamp, alldataSource, worktype);
        break;
      case 5:
        updateData(
          "backuplamp",
          alldataSource.backuplamp,
          alldataSource,
          worktype
        );
        break;
      case 6:
        updateData("door", alldataSource.door, alldataSource, worktype);
        break;
      default:
        break;
    }
  };

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

  // ตาราง
  const columns = [
    {
      title: (
        <h2 className={myFont.className} style={{ fontSize: 20 }}>
          รหัสอะไหล่
        </h2>
      ),
      dataIndex: "code",
      ...getColumnSearchProps("code"),
      render: (code) => (
        <h2 className={myFont.className} style={{ fontSize: 16 }}>
          {code}
        </h2>
      ),
      width: 100,
      //width: 200 ปิด
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
      width: 200,
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
            onConfirm={() => handleDelete(record)}
          >
            <>
              {isAdmin && (
                <Typography.Link style={{ fontSize: 20 }}>
                  <Tooltip
                    placement="bottom"
                    title={"ลบอะไหล่"}
                    overlayStyle={{ fontFamily: "ThursdayThin" }}
                  >
                    <DeleteOutlined />{" "}
                  </Tooltip>
                </Typography.Link>
              )}
            </>
          </Popconfirm>
        ) : null,
      width: 45,
    },
    {
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <>
            {false && (
              <Typography.Link
                onClick={() => handleEdit(record)}
                style={{ fontSize: 20 }}
              >
                <Tooltip
                  placement="bottom"
                  title={"แก้ไขอะไหล่"}
                  overlayStyle={{ fontFamily: "ThursdayThin" }}
                >
                  <EditFilled />
                </Tooltip>
              </Typography.Link>
            )}
          </>
        );
      },
      width: 15,
    },
  ];

  const onClick = (e) => {
    const numberAfterHyphen = parseInt(e.key.split("-")[1], 10);
    switch (numberAfterHyphen) {
      case 0:
        const all_frontbumper = alldataSource.all_frontbumper.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_frontbumper);
        setDataSource(alldataSource.frontbumper);
        setNamepartcar("กันชนหน้า");
        settypesend(0);
        break;
      case 1:
        const all_rearbumper = alldataSource.all_rearbumper.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_rearbumper);
        setDataSource(alldataSource.rearbumper);
        setNamepartcar("กันชนหลัง");
        settypesend(1);

        break;
      case 2:
        const all_grille = alldataSource.all_grille.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_grille);
        setDataSource(alldataSource.grille);
        setNamepartcar("กระจังหน้า");
        settypesend(2);
        break;
      case 3:
        const all_mirror = alldataSource.all_mirror.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_mirror);
        setDataSource(alldataSource.mirror);
        setNamepartcar("กระจกข้าง");
        settypesend(3);
        break;
      case 4:
        const all_headlamp = alldataSource.all_headlamp.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_headlamp);
        setDataSource(alldataSource.headlamp);
        setNamepartcar("ไฟหน้า");
        settypesend(4);
        break;
      case 5:
        const all_backuplamp = alldataSource.all_backuplamp.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_backuplamp);
        setDataSource(alldataSource.backuplamp);
        setNamepartcar("ไฟท้าย");
        settypesend(5);
        break;
      case 6:
        const all_door = alldataSource.all_door.map((item) => ({
          label: item.code,
          value: item.code,
          _id: item._id,
          name: item.name,
          price: item.price,
        }));
        setOptions(all_door);
        setDataSource(alldataSource.door);
        setNamepartcar("ประตู");
        settypesend(6);
        break;
      default:
        break;
    }
  };
  // -----------------------------------------------------------------

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    reset();
    setIsModalOpen(false);
  };
  const reset = () => {
    setSelectedYear(null);
    setSelectedBrand(null);
    setSelectedName(null);
    setTopic("เลือกปีที่ผลิตของรถยนต์");
  };
  useEffect(() => {
    const data = Array.from(new Set(carselect.map((item) => item.year)));
    const datasortnext = data.slice().sort((a, b) => b - a);
    setYears(datasortnext);
  }, [carselect]);

  useEffect(() => {
    const datatwo = carselect.filter((item) => item.year === selectedYear);
    setBrands(datatwo);
  }, [selectedYear]);
  // สร้างตัวเลือกชื่อ
  useEffect(() => {
    const datathree = brands.filter((item) => item.brand === selectedBrand);
    setNames(datathree);
  }, [selectedBrand]);

  const submit = async (name) => {
    setLoading(true);
    setShowContent(false);
    setBrandSave(selectedBrand);
    setYearSave(selectedYear);
    setNameSave(name);
    if (
      selectedBrand == requestbrand &&
      name == requestname &&
      selectedYear == requestyear
    ) {
      performAction();
    } else {
      router.push({
        pathname: "/TableCarPart",
        query: {
          requestbrand: selectedBrand,
          requestname: name,
          requestyear: selectedYear,
          pagetmp: "tmp-0",
        },
      });
    }
    reset();
    setIsModalOpen(false);
  };

  const handleOptionClick = (option, type) => {
    switch (type) {
      case "year":
        setSelectedYear(option);
        setTopic("เลือกยี่ห้อของรถยนต์");
        break;
      case "brand":
        setSelectedBrand(option);
        setTopic("เลือกรุ่นของรถยนต์");
        break;
      default:
        break;
    }
  };

  // -----------------------------------------------------------------

  return (
    <Spin
      spinning={loading}
      tip={`กำลังโหลด... ${brandsave} ${namesave} ${yearsave}`}
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
                <h1
                  className={myFont.className}
                  style={{ marginBottom: 40, marginTop: 40, fontSize: 18 }}
                >
                  {brandsave} {namesave} {yearsave}
                </h1>
                <Button
                  type="link"
                  className={myFont.className}
                  onClick={showModal}
                  style={{ marginLeft: 100, color: "black", fontSize: 16 }}
                >
                  เลือกรุ่นรถยนต์
                </Button>
                <Menu
                  className={myFont.className}
                  style={{ width: 229, fontSize: 16 }}
                  defaultSelectedKeys={[tmpdata]}
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
                    {brandsave} {namesave} {yearsave} - {namepartcar}
                  </div>
                  <br></br>
                  {/* ปิด */}
                  <>
                    {isAdmin && (
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
                    )}
                  </>

                  <>
                    {isAdmin && (
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
                    )}
                  </>
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
              title="เลือกเพิ่มอะไหล่ชิ้นส่วนรถยนต์"
              centered
              open={add}
              onOk={() => Addsubmit()}
              onCancel={() => {
                setAdd(false);
                setSelectedValues([]);
              }}
              okType="default"
              cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
              okText={<span className="custom-ok-button">เพิ่มอะไหล่</span>}
            >
              <Tooltip
                placement="topLeft"
                title={"เลือกรหัสอะไหล่"}
                overlayStyle={{ fontFamily: "ThursdayThin" }}
              >
                <Select
                  className={myFont.className}
                  mode="multiple"
                  style={{
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  allowClear
                  placeholder="รหัสอะไหล่"
                  onChange={handleChangeAdd}
                  value={selectedValues}
                  options={options}
                />
              </Tooltip>
            </Modal>

            <Modal
              className={myFont.className}
              title="เลือกแก้ไขอะไหล่"
              centered
              open={edit}
              onOk={() => Editsubmit()}
              onCancel={() => setEdit(false)}
              okType="default"
              cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
              okText={<span className="custom-ok-button">แก้ไข</span>}
            >
              <Select
                className={myFont.className}
                onChange={handleChangeEdit}
                showSearch
                style={{
                  width: "100%",
                  marginTop: 10,
                  marginBottom: 10,
                }}
                options={options}
                value={editValue}
              />
            </Modal>
            <Modal
              className={myFont.className}
              title="เลือกรถยนต์"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  ยกเลิก
                </Button>,
              ]}
            >
              <h1 className="mb-5 text-center" style={{ fontSize: 17 }}>
                {topic}
              </h1>
              {!selectedYear && (
                <button>
                  {years.map((year) => (
                    <Typography.Link
                      key={year}
                      className={myFont.className}
                      style={{
                        display: "inline-block",
                        marginLeft: 30,
                        fontSize: 17,
                      }}
                      onClick={() => handleOptionClick(year, "year")}
                    >
                      {year}
                    </Typography.Link>
                  ))}
                </button>
              )}

              {/* แบรนด์ */}
              {selectedYear && !selectedBrand && (
                <button>
                  {brands.map((val, index) => (
                    <Typography.Link
                      key={index}
                      className={myFont.className}
                      style={{
                        display: "inline-block",
                        marginLeft: 30,
                        fontSize: 17,
                      }}
                      onClick={() => handleOptionClick(val.brand, "brand")}
                    >
                      {val.brand}
                    </Typography.Link>
                  ))}
                </button>
              )}

              {/* ชื่อ */}
              {selectedBrand && (
                <button>
                  {names.map((val, index) => (
                    <Typography.Link
                      key={index}
                      className={myFont.className}
                      style={{
                        display: "inline-block",
                        marginLeft: 30,
                        fontSize: 17,
                      }}
                      onClick={() => submit(val.name)}
                    >
                      {val.name}
                    </Typography.Link>
                  ))}
                </button>
              )}
            </Modal>
            <Modal
              className={myFont.className}
              title="อัปโหลดไฟล์ Json อะไหล่รถยนต์"
              centered
              open={upload}
              okText={<span className="custom-ok-button">อัปโหลด</span>}
              cancelText={<span className="custom-cancel-button">ยกเลิก</span>}
              onOk={() => setUpload(handleUpload)}
              onCancel={handleCancelUpload}
              okType="default"
            >
              <Tooltip
                overlayStyle={{ fontFamily: "ThursdayThin" }}
                placement="topLeft"
                title={
                  "อัปโหลดไฟล์ Json สำหรับเพิ่มข้อมูลอะไหล่รถยนต์ โดยต้องมี ข้อมูล code คือ รหัสอะไหล่ที่ต้องการเพิ่ม"
                }
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
          </Layout>
        )}

        <Footer />
      </>
    </Spin>
  );
};

export default TableCarPart;
//
