import { useState } from "react";
import Image from "next/image";
import partcar from "../img/partcar.png";
import Link from "next/link";
import { useRouter } from "next/router";

import Navbar from "./components/NavBar";

import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!value) {
      setEmailError("กรุณากรอกอีเมล");
    } else if (!emailRegex.test(value)) {
      setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("กรุณากรอกพาสเวิร์ด");
    } else if (value.length < 6) {
      setPasswordError("พาสเวิร์ดต้องมีอย่างน้อย 6 ตัวอักษร");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailError && !passwordError) {
      setEmail("");
      setPassword("");
    }
  };

  const login = async () => {
    localStorage.setItem('Admin', 'true')

    router.push({
      pathname: '/',
    })
  }
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center" style={{ marginTop: 200 }}>
        <div className={myFont.className}>
          <div
            className="text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
            style={{ maxWidth: "1000px", borderWidth: 1 }}
          >
            <div className="md:flex w-full">
              <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                <div className="text-center mb-10">
                  <h1 className="font-bold text-3xl text-gray-900">
                    เข้าสู่ระบบ
                  </h1>
                  <p>โปรดกรอกข้อมูลของคุณ</p>
                </div>
                <div>
                  <form onSubmit={handleSubmit}>
                    <div className="flex -mx-3">
                      <div className="w-full px-3 mb-5">
                        <label className="text-xs font-semibold px-1">
                          อีเมล
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="กรอกอีเมล"
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                          />
                        </div>
                        {emailError && (
                          <p className="text-xs text-red-500 mt-1">
                            {emailError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex -mx-3">
                      <div className="w-full px-3 mb-5">
                        <label className="text-xs font-semibold px-1">
                          รหัสผ่าน
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                          </div>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="กรอกรหัสผ่าน"
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                          />
                        </div>
                        {passwordError && (
                          <p className="text-xs text-red-500 mt-1">
                            {passwordError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex -mx-3">
                      <div className="w-full px-3 mb-5">
                        <button
                          type="submit"
                          className="block w-full max-w-xs mx-auto text-white rounded-lg px-3 py-3"
                          style={{ backgroundColor: "#6078FA" }}
                          onClick={() => login()}
                        >
                          เข้าสู่ระบบ
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div
                className="hidden md:block w-1/2 py-20"
                style={{ backgroundColor: "#6078FA" }}
              >
                <Image src={partcar} width={500} height={200} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
