import { Card, Col, Row, Statistic } from "antd";
import {
  ArrowUpOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
export default function StatCards({ projects }) {
  const stats = [
    {
      label: "Total projects",
      value: projects.length,
      icon: <ProjectOutlined />,
      trend: "+12.5%",
      tone: "orange",
    },
    {
      label: "Upcoming projects",
      value: projects.filter((p) =>
        ["Upcoming", "Confirmed"].includes(p.status),
      ).length,
      icon: <CalendarOutlined />,
      trend: "Next 30 days",
      tone: "blue",
    },
    {
      label: "Completed projects",
      value: projects.filter((p) => p.status === "Completed").length,
      icon: <CheckCircleOutlined />,
      trend: "+8.2%",
      tone: "green",
    },
    {
      label: "Pending projects",
      value: projects.filter((p) => p.paymentStatus === "Pending").length,
      icon: <ClockCircleOutlined />,
      trend: "Needs attention",
      tone: "red",
    },
  ];
  return (
    <Row gutter={[16, 16]} className="stat-grid">
      {stats.map((stat) => (
        <Col xs={24} sm={12} xl={6} key={stat.label}>
          <Card className="stat-card">
            <div className={`stat-icon ${stat.tone}`}>{stat.icon}</div>
            <Statistic title={stat.label} value={stat.value} />
            <span className={`stat-trend ${stat.tone}`}>
              <ArrowUpOutlined /> {stat.trend}
            </span>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
