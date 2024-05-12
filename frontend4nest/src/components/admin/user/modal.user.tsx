import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Row, Upload, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchCompany, callFetchRole, callUpdateUser, callUploadSingleFile } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IUserAvatar {
    name: string;
    uid: string;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [roles, setRoles] = useState<ICompanySelect[]>([]);

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataAvatar, setDataAvatar] = useState<IUserAvatar[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id) {

            if (dataInit.company) {
                setCompanies([{
                    label: dataInit.company.name,
                    value: dataInit.company._id,
                    key: dataInit.company._id,
                }])
            }

            if (dataInit.role) {
                setRoles([
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?._id,
                        key: dataInit.role?._id,
                    }
                ])
            }
        }
    }, [dataInit]);

    const handleRemoveFile = (file: any) => {
        setDataAvatar([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileAvatar = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "user");
        if (res && res.data) {
            setDataAvatar([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataAvatar([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role, company, phone } = valuesForm;

        if (dataAvatar.length === 0) {
            message.error('Vui lòng upload ảnh Logo')
            return;
        }

        if (dataInit?._id) {
            //update
            const user = {
                _id: dataInit._id,
                name,
                email,
                password,
                age,
                gender,
                address,
                phone,
                avatar: dataAvatar[0].name,
                role: role.value,
                company: {
                    _id: company.value,
                    name: company.label
                }
            }

            const res = await callUpdateUser(user);
            if (res.data) {
                message.success("Cập nhật user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const user = {
                name,
                email,
                password,
                age,
                gender,
                address,
                phone,
                avatar: dataAvatar[0].name,
                role: role.value,
                company: {
                    _id: company.value,
                    name: company.label
                }
            }

            const res = await callCreateUser(user);
            if (res.data) {
                message.success(`Thêm mới user ${user.name} thành công`);
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setCompanies([]);
        setRoles([]);
        setOpenModal(false);
    }

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchRole(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            {openModal &&
                <ModalForm
                    title={<>{dataInit?._id ? "Cập nhật User" : "Tạo mới User"}</>}
                    open={openModal}
                    modalProps={{
                        onCancel: () => { handleReset() },
                        afterClose: () => handleReset(),
                        destroyOnClose: true,
                        width: isMobile ? "100%" : 900,
                        keyboard: false,
                        maskClosable: false,
                        okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                        cancelText: "Hủy"
                    }}
                    scrollToFirstError={true}
                    preserve={false}
                    form={form}
                    onFinish={submitUser}
                    initialValues={dataInit?._id ? dataInit : {}}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh"
                                name="avatar"
                                rules={[{
                                    required: true,
                                    message: 'Vui lòng không bỏ trống',
                                    validator: () => {
                                        if (dataAvatar.length > 0) return Promise.resolve();
                                        else return Promise.reject(false);
                                    }
                                }]}
                            >
                                <ConfigProvider locale={enUS}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileAvatar}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={(file) => handleRemoveFile(file)}
                                        onPreview={handlePreview}
                                        defaultFileList={
                                            dataInit?._id ?
                                                [
                                                    {
                                                        uid: uuidv4(),
                                                        name: dataInit?.avatar ?? "",
                                                        status: 'done',
                                                        url: `${import.meta.env.VITE_BACKEND_URL}/images/user/${dataInit?.avatar}`,
                                                    }
                                                ] : []
                                        }

                                    >
                                        <div>
                                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </ConfigProvider>
                            </Form.Item>

                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ProFormText
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng không bỏ trống' },
                                    { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                                ]}
                                placeholder="Nhập email"
                            />
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ProFormText.Password
                                disabled={dataInit?._id ? true : false}
                                label="Password"
                                name="password"
                                rules={[{ required: dataInit?._id ? false : true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập password"
                            />
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ProFormText
                                label="Điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập số điện thoại"
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormText
                                label="Tên hiển thị"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập tên hiển thị"
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormDigit
                                label="Tuổi"
                                name="age"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập nhập tuổi"
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormSelect
                                name="gender"
                                label="Giới Tính"
                                valueEnum={{
                                    MALE: 'Nam',
                                    FEMALE: 'Nữ',
                                    OTHER: 'Khác',
                                }}
                                placeholder="Please select a gender"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProForm.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    defaultValue={roles}
                                    value={roles}
                                    placeholder="Chọn công vai trò"
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: any) => {
                                        if (newValue?.length === 0 || newValue?.length === 1) {
                                            setRoles(newValue as ICompanySelect[]);
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>

                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item
                                name="company"
                                label="Thuộc Công Ty"
                                rules={[{ required: true, message: 'Vui lòng chọn company!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    defaultValue={companies}
                                    value={companies}
                                    placeholder="Chọn công ty"
                                    fetchOptions={fetchCompanyList}
                                    onChange={(newValue: any) => {
                                        if (newValue?.length === 0 || newValue?.length === 1) {
                                            setCompanies(newValue as ICompanySelect[]);
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>

                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập địa chỉ"
                            />
                        </Col>
                    </Row>
                </ModalForm>
            }
        </>
    )
}

export default ModalUser;
