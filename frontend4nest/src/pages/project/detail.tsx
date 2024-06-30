import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IProject } from "@/types/backend";
import { callFetchProjectById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";


const ClientProjectDetailPage = (props: any) => {
    const [projectDetail, setProjectDetail] = useState<IProject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchProjectById(id);
                if (res?.data) {
                    setProjectDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {projectDetail && projectDetail._id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {projectDetail.name}
                                </div>

                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(projectDetail?.address)}
                                </div>

                                <Divider />
                                {parse(projectDetail?.description ?? "")}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["project"]}>
                                    <div>
                                        <img
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/project/${projectDetail?.logo}`}
                                            width={250}
                                        />
                                    </div>
                                    <div>
                                        {projectDetail?.name}
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientProjectDetailPage;