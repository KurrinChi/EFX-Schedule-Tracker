import { useState } from "react";
import {
  Button,
  Descriptions,
  Dropdown,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { systemConfig } from "../../config/systemConfig";

const statusColors = {
  Upcoming: "orange",
  Confirmed: "blue",
  "In Progress": "gold",
  Completed: "green",
};

export default function ProjectTable({
  projects,
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
  onView,
  onEdit,
  onDelete,
}) {
  const [viewingProject, setViewingProject] = useState(null);

  const filtered = projects.filter(
    (p) =>
      `${p.clientName} ${p.projectType} ${p.location}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!status || p.status === status) &&
      (!payment || p.paymentStatus === payment),
  );

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const columns = [
    {
      title: "DATE",
      dataIndex: "eventDate",
      render: (date) => (
        <span className="date-cell">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: "CLIENT",
      dataIndex: "clientName",
      render: (name) => (
        <Tooltip title={name}>
          <strong className="cell-ellipsis">{name}</strong>
        </Tooltip>
      ),
    },
    {
      title: "PROJECT",
      dataIndex: "projectType",
      render: (type) => <span className="muted-cell">{type}</span>,
    },
    {
      title: "PACKAGE",
      dataIndex: "packageName",
    },
    {
      title: "LOCATION",
      dataIndex: "location",
      render: (location) => (
        <Tooltip title={location}>
          <span className="muted-cell cell-ellipsis">{location}</span>
        </Tooltip>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (value) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    {
      title: "PAYMENT",
      dataIndex: "paymentStatus",
      render: (value) => (
        <span className={`payment ${value.toLowerCase()}`}>
          <span />
          {value}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                icon: <EyeOutlined />,
                label: "View",
                onClick: () => {
                  setViewingProject(record);
                },
              },
              {
                key: "edit",
                icon: <EditOutlined />,
                label: "Edit",
                onClick: () => onEdit(record),
              },
              {
                type: "divider",
              },
              {
                key: "delete",
                danger: true,
                icon: <DeleteOutlined />,
                label: "Delete",
                onClick: () => onDelete(record),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <div className="project-section">
        <div className="section-heading">
          <div>
            <h2>Projects</h2>
            <span>{filtered.length} productions in your workspace</span>
          </div>

          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              allowClear
              placeholder="Status"
              value={status}
              onChange={setStatus}
              options={systemConfig.projectStatuses.map((value) => ({
                value,
                label: value,
              }))}
            />

            <Select
              allowClear
              placeholder="Payment"
              value={payment}
              onChange={setPayment}
              options={["Paid", "Pending"].map((value) => ({
                value,
                label: value,
              }))}
            />
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={{
            pageSize: systemConfig.pagination.defaultPageSize,
            showSizeChanger: false,
          }}
          scroll={{ x: 960 }}
        />
      </div>

      {/* PROJECT DETAILS MODAL */}
      <Modal
        title="Project Details"
        open={Boolean(viewingProject)}
        onCancel={() => setViewingProject(null)}
        footer={[
          <Button key="close" onClick={() => setViewingProject(null)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              const project = viewingProject;

              setViewingProject(null);

              onEdit(project);
            }}
          >
            Edit Project
          </Button>,
        ]}
        width={720}
        centered
      >
        {viewingProject && (
          <Descriptions
            bordered
            column={{
              xs: 1,
              sm: 2,
            }}
            size="middle"
          >
            <Descriptions.Item label="Client">
              {viewingProject.clientName || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Project Type">
              {viewingProject.projectType || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Package">
              {viewingProject.packageName || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag color={statusColors[viewingProject.status]}>
                {viewingProject.status || "—"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Payment">
              <span
                className={`payment ${
                  viewingProject.paymentStatus?.toLowerCase() || ""
                }`}
              >
                <span />
                {viewingProject.paymentStatus || "—"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Event Date">
              {formatDate(viewingProject.eventDate)}
            </Descriptions.Item>

            <Descriptions.Item label="Location" span={2}>
              {viewingProject.location || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Project ID" span={2}>
              {viewingProject.id || "—"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
}
