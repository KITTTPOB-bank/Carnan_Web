import React, { useState, useEffect } from "react";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import {
    Layout,
    Menu,
    Spin, Tooltip,
    Modal

} from "antd";
const { Content, Sider } = Layout;
import axios from "axios";
import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });
const { confirm } = Modal;
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRouter } from "next/router";

const imagescar = () => {
    const router = useRouter();

    const { name, brand, year } = router.query;

    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [namepartcar, setNamepartcar] = useState("รูปรถยนต์ทั้งคัน");
    const [images, setimages] = useState([]);
    const [allimages, setAllimages] = useState([]);

    useEffect(() => {
        if (name || brand || year) {
            fetchDataimage();
        }

    }, [name, brand, year]);
    const loadpage = async () => {
        const timeout = setTimeout(() => {
            setLoading(false);
            setShowContent(true);
        }, 1000);

        return () => clearTimeout(timeout);
    };
    const fetchDataimage = async () => {
        try {
            const apiUrl = "https://54.173.229.99/getaws3image";
            const queryParams = {
                brand: brand,
                name: name,
                year: year,
            };
            const response = await axios.get(apiUrl, {
                params: queryParams,
            });
            const image = response.data
            setAllimages(image)
            setimages(image.body)

        } catch (error) {
            console.error("Error fetching data:", error);
        }
        loadpage();

    };

    const sideritem = [
        {
            label: "รูปรถยนต์ทั้งคัน",
        },
        {
            label: "รูปกันชนหน้า",
        },
        {
            label: "รูปกันชนหลัง",
        },
        {
            label: "รูปไฟหน้า",
        },
        {
            label: "รูปไฟท้าย",
        },
        {
            label: "รูปประตู",
        }
    ];


    const onClick = (e) => {
        const numberAfterHyphen = parseInt(e.key.split("-")[1], 10);
        switch (numberAfterHyphen) {
            case 0:
                setNamepartcar("รูปรถยนต์ทั้งคัน");
                setimages(allimages.body)
                break;
            case 1:
                setNamepartcar("รูปกันชนหน้า");
                setimages(allimages.frontbumper)
                break;
            case 2:
                setNamepartcar("รูปกันชนหลัง");
                setimages(allimages.rearbumper)
                break;
            case 3:
                setNamepartcar("รูปไฟหน้า");
                setimages(allimages.headlamp)
                break;
            case 4:
                setNamepartcar("รูปไฟท้าย");
                setimages(allimages.backuplamp)
                break;
            case 5:
                setNamepartcar("รูปประตู");
                setimages(allimages.door)
                break;
            default:
                break;
        }
    };
    const showDeleteConfirm = (index) => {
        confirm({
            title: 'ยืนยันที่จะลบรูปภาพ ?',
            icon: <ExclamationCircleFilled />,
            okText: 'ตกลง',
            okType: 'danger',
            cancelText: 'ยกเลิก',
            onOk() {
                handleDeleteImage(index)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleDeleteImage = async (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        // const apiUrl = "https://54.173.229.99/dropimage";
        // const queryParams = {
        //     name: images[index],
        // };
        // await axios.get(apiUrl, {
        //     params: queryParams,
        // });
        setimages(updatedImages)
    };
    return (
        <Spin
            spinning={loading}
            tip="กำลังโหลดรูปภาพรถยนต์..."
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
                                        {namepartcar}ของ {brand} {name} {year}
                                    </div>
                                    <br></br>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                        }}
                                    >

                                        {images && images.map((image, index) => (
                                            <Tooltip title="คลิกเพื่อลบรูปภาพ" key={index}>
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Image ${index + 1}`}
                                                    onClick={() => showDeleteConfirm(index)}
                                                    style={{
                                                        width: "20%",
                                                        padding: 10
                                                    }}
                                                />
                                            </Tooltip>
                                        ))}
                                    </div>
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

export default imagescar;
