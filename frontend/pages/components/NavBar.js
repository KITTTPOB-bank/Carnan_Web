import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import logocar from '../../img/logocar.png';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import Drawer from '../components/Drawer'

const myFont = localFont({ src: '../../fonts/ThursdayThin.ttf' });

const { Header } = Layout;

const NavBar = () => {
  const router = useRouter();

  const [isAdmin, setisAdmin] = useState(false);

  const logout = async () => {
    localStorage.removeItem('Admin');

    router.push({
      pathname: '/Login',
    })
  }
  const isLoginPage = router.pathname == '/Login';

  useEffect(() => {
    if(localStorage.getItem('Admin') == undefined){
      const isAdmin = false;
      setisAdmin(isAdmin)
    }else{
      const isAdmin = true
      setisAdmin(isAdmin)
    }
    console.log(localStorage)
  } ,[])

  return (
    <Layout className="layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#6078FA',
          justifyContent: 'space-between',
        }}>
        {!isAdmin && <a> </a>}
        {isAdmin && <Drawer />}
        <a href="/">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={logocar} style={{ marginTop: 20 }} />
            <span className={myFont.className} style={{ color: 'white', fontSize: 24, marginLeft: -50 }}>
              Carnan
            </span>
          </div>
        </a>

        {!isAdmin && (
          <a href="/Login" className={myFont.className} style={{ color: 'white', fontSize: 16, justifyContent: 'space-between' }}>
            เข้าสู่ระบบ
          </a>
        )}
        {isAdmin && (
          <a onClick={logout} className={myFont.className} style={{ color: 'white', fontSize: 16, justifyContent: 'space-between' }}>
          ออกจากระบบ
        </a>
        )}
      </Header>
    </Layout>
  );
};

export default NavBar;
