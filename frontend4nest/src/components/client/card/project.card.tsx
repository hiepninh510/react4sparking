import { callFetchProject } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { IProject } from '@/types/backend';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const ProjectCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayProject, setDisplayProject] = useState<IProject[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProject();
    }, [current, pageSize, filter, sortQuery]);

    const fetchProject = async () => {
        setIsLoading(true)
        //setFilter(`name: "Ministop Nguyễn Văn Khối"`)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchProject(query);
        if (res && res.data) {
            setDisplayProject(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IProject) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/project/${slug}?id=${item._id}`)
        }
    }

    return (
        <div className={`${styles["project-section"]}`}>
            <div className={styles["project-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Các dự án đã thực hiện</span>
                                {!showPagination &&
                                    <Link to="project">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayProject?.map(item => {
                            return (
                                <Col span={24} md={6} key={item._id}>
                                    <Card
                                        onClick={() => handleViewDetailJob(item)}
                                        style={{ height: 350 }}
                                        hoverable
                                        cover={
                                            <div className={styles["card-customize"]} >
                                                <img
                                                    alt="project-img"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/Project/${item?.logo}`}
                                                    width={195}
                                                />
                                            </div>
                                        }
                                    >
                                        <Divider />
                                        <h3 style={{ textAlign: "center" }}>{item.name}</h3>
                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayProject || displayProject && displayProject.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default ProjectCard;