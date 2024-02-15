import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import localFont from "next/font/local";
import { Card } from 'antd';
import { useRouter } from 'next/router';
import { Spin } from "antd";
const myFont = localFont({ src: "../fonts/ThursdayThin.ttf" });

import NavBar from './components/NavBar'
import axios from 'axios';


const UploadImage = () => {
    const router = useRouter();
    const { uploadtype, text, name, brand, year } = router.query;
    const [loading, setLoading] = useState(false);

    const [files, setFiles] = useState([])
    const [rejected, setRejected] = useState([])

    const [namesend, setNameSend] = useState('')
    const [brandsend, setBrandSend] = useState('')
    const [yearsend, setYearSend] = useState(null)
    const [typesend, setTypesend] = useState(0)


    useEffect(() => {
        setNameSend(name)
        setBrandSend(brand)
        setYearSend(year)
        setTypesend(uploadtype)
    }, [uploadtype, name, brand, year])


    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (acceptedFiles?.length) {
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles.map(file =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
            ])
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: 1024 * 1000,
        onDrop
    })
    const submit = async () => {
        const apiUrl = 'http://13.211.124.91/uploadscars';
        if (files.length == 0) {
            alert('ไม่มีรูปภาพที่จะอัปโหลด!')
            return
        }
        setLoading(true)
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            formData.append(`files`, file);
        }
        formData.append('name', namesend);
        formData.append('brand', brandsend);
        formData.append('year', yearsend);
        formData.append('typecheck', typesend);
        console.log(formData.get('files'))


        try {
            await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFiles([])
            setRejected([])
            setLoading(false)
            alert('เพิ่มรูปภาพสำเร็จ')

        } catch (error) {
            alert('เพิ่มรูปภาพไม่สำเร็จ')
            setLoading(false)

            console.error('Error:', error.response);
        }
    }

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview))
    }, [files])

    const removeFile = name => {
        setFiles(files => files.filter(file => file.name !== name))
    }

    const removeAll = () => {
        setFiles([])
        setRejected([])
    }



    return (
        <Spin spinning={loading} tip="กำลังอัปโหลดรูปภาพรถยนต์..." style={{ marginTop: "15%" }}>

            <div className={myFont.className}>
                <NavBar />
                <br></br>
                <div className="w-full" style={{ padding: "2%" }}>
                    <h1 className="text-3xl font-bold text-center mb-6 text-black">
                        อัปโหลดรูป{text} - {brand} {name} {year}
                    </h1>
                    <br></br>
                    <br></br>

                    <div>
                        <Card bordered={true} style={{ width: 350, height: 130, margin: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} className={myFont.className}
                            {...getRootProps({
                            })}
                        >
                            <input {...getInputProps()} />
                            <div className='flex flex-col items-center justify-center gap-4 mt-2' style={{ fontSize: 17 }}>
                                <ArrowUpTrayIcon className='w-5 h-5 fill-current' />
                                <p>เลือกรูปภาพไฟล์ที่จะทำการอัปโหลด</p>
                            </div>
                        </Card>

                        {/* Preview */}
                        <section className='mt-10 ml-3'>


                            <h3 className='title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3 flex justify-between items-center'>
                                <span className='text-[18px]' >รูปภาพที่เลือก</span>

                                <div>
                                    <button
                                        type='button'
                                        onClick={removeAll}
                                        className='text-[18px] uppercase  font-bold border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-black '
                                    >
                                        ลบรูปภาพทั้งหมด
                                    </button>

                                    <button
                                        className='text-[18px] ml-2 uppercase  font-bold border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-black '
                                        onClick={submit}
                                        type="submit"
                                    >
                                        อัปโหลด
                                    </button>
                                </div>
                            </h3>


                            <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10'>
                                {files.map(file => (
                                    <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
                                        <Image
                                            src={file.preview}
                                            alt={file.name}
                                            width={100}
                                            height={100}
                                            onLoad={() => {
                                                URL.revokeObjectURL(file.preview)
                                            }}
                                            className='h-full w-full object-contain rounded-md'
                                        />
                                        <button
                                            type='button'
                                            className='w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors'
                                            onClick={() => removeFile(file.name)}
                                        >
                                            <XMarkIcon className='w-5 h-5 fill-black hover:fill-secondary-400 transition-colors' />
                                        </button>
                                        <p className='mt-2 text-neutral-500 text-[12px] font-medium'>
                                            {file.name}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>

            </div>
        </Spin>
    )
}
export default UploadImage
//