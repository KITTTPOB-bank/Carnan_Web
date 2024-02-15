import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import {
    Layout,
    Button,
    Table,
    Spin,
    Typography,
    Dropdown,
    Input, Space, Tooltip
} from "antd";
import { useRouter } from 'next/router';

const { Content } = Layout;
import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });
import { SearchOutlined, UnorderedListOutlined, CarOutlined, EditOutlined } from "@ant-design/icons";

import axios from "axios";
const carimagemanager = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [showContent, setShowContent] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);



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
            const apiUrl = 'http://13.211.124.91/cardataadmin';
            const response = await axios.get(apiUrl);
            setDataSource(response.data);
            console.log(dataSource)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters();
        setSearchText('');
        confirm();
        setSearchedColumn(dataIndex);

    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
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
                        onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
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
                    color: filtered ? '#1677ff' : undefined,
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
        // เอาออกได้
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });
    const generateMenuItems = (record) => {
        return [
            {
                key: '1',
                label: (
                    <a onClick={() => Nexttablecarpart(0, "กันชนหน้ารถยนต์", record)}>
                        รูปกันชนหน้า
                    </a>
                ),
            },
            {
                key: '2',
                label: (
                    <a onClick={() => Nexttablecarpart(1, "กันชนหลังรถยนต์", record)}>
                        รูปกันชนหลัง
                    </a>
                ),
            },
            {
                key: '3',
                label: (
                    <a onClick={() => Nexttablecarpart(4, "ไฟหน้ารถยนต์", record)}>
                        รูปไฟหน้า
                    </a>
                ),
            },
            {
                key: '4',
                label: (
                    <a onClick={() => Nexttablecarpart(5, "ไฟท้ายรถยนต์", record)}>
                        รูปไฟท้าย
                    </a>
                ),
            },
            {
                key: '5',
                label: (
                    <a onClick={() => Nexttablecarpart(6, "ประตูรถยนต์", record)}>
                        รูปประตู
                    </a>
                ),
            },
        ];
    };

    const columns = [
        {
            title: (
                <h2 className={myFont.className} style={{ fontSize: 20 }}>
                    ยี่ห้อรถยนต์
                </h2>
            ),
            dataIndex: "brand",
            ...getColumnSearchProps('brand'),
            width: 250,
        },
        {
            title: (
                <h2 className={myFont.className} style={{ fontSize: 20 }}>
                    รุ่นรถยนต์
                </h2>
            ),
            dataIndex: "name",
            ...getColumnSearchProps('name'),
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
            showSorterTooltip: false
        },

        {
            dataIndex: "operation",
            render: (_, record) => {
                return (
                    <Space size={'large'}>
                        <Tooltip placement="top" title={'แก้ไขรูปภาพ'} onClick={() => Nextimagespage(record)}>
                            <Typography.Link style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>
                                <EditOutlined />
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip placement="top" title={'อัปโหลดรูปรถยนต์'} onClick={() => Nexttablecarpart(7, "รถยนต์", record)}>
                            <Typography.Link style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>
                                <CarOutlined />
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip placement="top" title={'อัปโหลดรูปชิ้นส่วนรถยนต์'}>
                            <Dropdown
                                menu={{
                                    items: generateMenuItems(record),
                                }}
                                placement="bottom"
                                arrow

                            >
                                <Typography.Link style={{ fontSize: 20 }}
                                >
                                    <UnorderedListOutlined />
                                </Typography.Link>
                            </Dropdown>
                        </Tooltip>
                    </Space >
                )
            }
            ,


            width: 200

        },
    ];
    const Nexttablecarpart = async (type, textnext, recode) => {
        router.push({
            pathname: '/UploadImage',
            query: {
                uploadtype: type,
                text: textnext,
                name: recode.name,
                brand: recode.brand,
                year: recode.year
            }
        });

    }

    const Nextimagespage = async (data) => {
        router.push({
            pathname: '/imagescar',
            query: {
                name: data.name,
                brand: data.brand,
                year: data.year
            }
        });

    }


    return (
        <Spin spinning={loading} tip="กำลังโหลดข้อมูลรถยนค์..." style={{ marginTop: "20%" }}>
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
                                    <div style={{
                                        textAlign: 'center'
                                    }}>
                                        จัดการรูปภาพรถยนต์

                                    </div>
                                    <br></br>


                                    <Table
                                        columns={columns}
                                        dataSource={dataSource}

                                        pagination={{
                                            pageSize: 7, showSizeChanger: false
                                        }} />
                                </>
                            </Content>

                        </Layout>
                    </Layout>
                )}

                <Footer />
            </>
        </Spin>
    );
};

export default carimagemanager;
