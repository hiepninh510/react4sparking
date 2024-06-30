import { Col, Row } from 'antd';
import styles from 'styles/client.module.scss';
import ProjectCard from '@/components/client/card/project.card';

const ClientProjectPage = (props: any) => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <ProjectCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientProjectPage;