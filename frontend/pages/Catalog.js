import Navbar from "./components/NavBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Tooltip
} from "antd";
import localFont from "next/font/local";

const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });;
export default function Catalog() {
  const router = useRouter();
  const routercome = useRouter();
  const { year, brand, name } = routercome.query;
  const [namekeep, setnamekeep] = useState(null);
  const [yearkeep, setyearkeep] = useState(null);
  const [brandkeep, setbrandkeep] = useState(null);
  const [Namepartcar, setNamepartcar] = useState("");
  const handleTouch = (type) => {
    let Namepartcar = 'กันชนหน้า'
    switch (type) {
      case "tmp-0":
        Namepartcar = "กันชนหน้า"
        break;
      case "tmp-1":
        Namepartcar = "กันชนหลัง"
        break;
      case "tmp-2":
        Namepartcar = "กระจังหน้า"
        break;
      case "tmp-3":
        Namepartcar = "กระจกข้าง"
        break;
      case "tmp-4":
        Namepartcar = "ไฟหน้า"
        break;
      case "tmp-5":
        Namepartcar = "ไฟท้าย"
        break;
      case "tmp-6":
        Namepartcar = "ประตู"
        break;
      default:
        break;
    }
    router.push({
      pathname: '/TableCarPart',
      query: {
        requestyear: yearkeep,
        requestbrand: brandkeep,
        requestname: namekeep,
        pagetmp: type,
        nametype: Namepartcar
      },
    });
  };

  useEffect(() => {
    if (routercome && routercome.query.year && routercome.query.brand && routercome.query.name) {
      setnamekeep(routercome.query.name)
      setyearkeep(routercome.query.year)
      setbrandkeep(router.query.brand)
    }
  }, [routercome]);

  return (
    <div className={myFont.className}>
      <Navbar />
      <br></br>
      <div className="container mx-auto lg:max-w-screen-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          ชิ้นส่วนรถยนต์ - {router.query.brand}  {router.query.name}  {router.query.year}
        </h1>
        <br></br>
        <br></br>

        <div class="grid md:grid-cols-3 gap-20">
          <Tooltip placement="top" title={"ดูอะไหล่กันชนหน้า"}>
            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-0')}
            >
              <figure>
                <img
                  src="https://ecommerce.toyota.com/media/catalog/category/Camry_2022_AccentLights_D_1.jpeg"
                  style={{ borderWidth: 1 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center ">กันชนหน้า</h2>
              </div>
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ดูอะไหล่กันชนหลัง"}>

            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-1')}
            >

              <figure>
                <img
                  src="https://hondaaccess.co.th/public/img/product/lineup/civic/exterior/rr-lower-garnish.jpg "
                  style={{ borderWidth: 1 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center font-bold">
                  กันชนหลัง
                </h2>
              </div>
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ดูอะไหล่กระจังหน้า"}>

            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-2')}
            >

              <figure>
                <img
                  src="https://hondaaccess.co.th/public/img/product/lineup/civic/exterior/fr-grille-garnish.jpg"
                  style={{ borderWidth: 1 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center font-bold">
                  กระจังหน้า
                </h2>

              </div>

            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ดูอะไหล่กระจกข้าง"}>

            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-3')}
            >

              <figure>
                <img
                  src="https://i.etsystatic.com/26503669/r/il/1cd920/2787038139/il_1588xN.2787038139_qeta.jpg"
                  style={{ borderWidth: 1, height: 150, width: 280 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center font-bold">
                  กระจกข้าง
                </h2>

              </div>

            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ดูอะไหล่ไฟหน้า"}>

            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-4')}
            >

              <figure>
                <img
                  src="https://static.thairath.co.th/media/B6FtNKtgSqRqbnNsbGBLNRcUH6uQKz9VIb8KT4ORSg4rRapIrlJlxl1v5L4VXaeKsWyGE.jpg"
                  style={{ borderWidth: 1 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center font-bold">ไฟหน้า</h2>
              </div>
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ดูอะไหล่ไฟท้าย"}>


            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-5')}
            >

              <figure>
                <img
                  src="https://www.livemotorsale.com/images/editor/dimention%2003%209433/%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B8%A3%E0%B8%96%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%87%20Honda%20civic%20es%202003%20livemotorsale7.jpg"
                  style={{ borderWidth: 1, height: 150, width: 280 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center font-bold">ไฟท้าย</h2>
              </div>
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ดูอะไหล่ประตู"}>


            <div className={`cardgonext text-center`} onClick={() => handleTouch('tmp-6')}
            >

              <figure>
                <img
                  src="https://ecommerce.toyota.com/media/catalog/category/Corolla_2020_BodySideMolding_D_A.jpg"
                  style={{ borderWidth: 1 }}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title  flex justify-center font-bold">ประตู</h2>
              </div>
            </div>
          </Tooltip>
        </div>

      </div>
    </div>
  );
}
