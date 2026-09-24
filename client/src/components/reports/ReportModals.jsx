import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { brandingConfig } from "../../config/brandingConfig";
import { appConfig } from "../../config/appConfig";
import { systemConfig } from "../../config/systemConfig";

const reportColumns = [
  { title: "Date", dataIndex: "eventDate" },
  { title: "Client", dataIndex: "clientName", ellipsis: true },
  { title: "Project", dataIndex: "projectType" },
  { title: "Package", dataIndex: "packageName", ellipsis: true },
  { title: "Service", dataIndex: "serviceName", ellipsis: true },
  { title: "Location", dataIndex: "location", ellipsis: true },
  { title: "Status", dataIndex: "status" },
  { title: "Payment", dataIndex: "paymentStatus" },
];

export function ReportFilterModal({
  open,
  onCancel,
  onGenerate,
  clients = [],
  packages = [],
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const submit = async (values) => {
    setSubmitting(true);
    try {
      await onGenerate(values);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      open={open}
      title="Generate project report"
      okText="Build report"
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item
          name="reportType"
          label="Report type"
          initialValue="Projects"
        >
          <Select
            options={["Projects", "Payments", "Production summary"].map(
              (value) => ({ value, label: value }),
            )}
          />
        </Form.Item>
        <Form.Item name="dateRange" label="Date range">
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            allowClear
            options={systemConfig.projectStatuses.map((value) => ({
              value,
              label: value,
            }))}
          />
        </Form.Item>
        <Form.Item name="paymentStatus" label="Payment status">
          <Select
            allowClear
            options={systemConfig.paymentStatuses.map((value) => ({
              value,
              label: value,
            }))}
          />
        </Form.Item>
        <Form.Item name="clientId" label="Client">
          <Select
            allowClear
            options={clients.map(({ id, fullName }) => ({
              value: id,
              label: fullName,
            }))}
          />
        </Form.Item>
        <Form.Item name="packageId" label="Package">
          <Select
            allowClear
            options={packages.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function Summary({ projects }) {
  const values = [
    ["Total projects", projects.length],
    [
      "Confirmed",
      projects.filter((project) => project.status === "Confirmed").length,
    ],
    [
      "Completed",
      projects.filter((project) => project.status === "Completed").length,
    ],
    [
      "Paid",
      projects.filter((project) => project.paymentStatus === "Paid").length,
    ],
    [
      "Partial",
      projects.filter((project) => project.paymentStatus === "Partial").length,
    ],
    [
      "Unpaid",
      projects.filter((project) => project.paymentStatus === "Pending").length,
    ],
  ];
  return (
    <div className="report-summary">
      {values.map(([label, value]) => (
        <Statistic key={label} title={label} value={value} />
      ))}
    </div>
  );
}

export function ReportPreviewModal({ open, onCancel, report }) {
  const projects = report?.projects || [];
  const period = report?.period || "All scheduled projects";
  return (
    <Modal
      open={open}
      title="Report preview"
      width={1100}
      className="report-modal"
      footer={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
        >
          Print / save PDF
        </Button>
      }
      onCancel={onCancel}
      destroyOnHidden
    >
      <article className="report-document" id="report-document">
        <header className="report-document-header">
          <img src={brandingConfig.logo} alt={brandingConfig.name} />
          <div>
            <Typography.Text className="report-kicker">
              SCHEDULE &amp; PROJECT REPORT
            </Typography.Text>
            <h1>{report?.title || "Production overview"}</h1>
          </div>
        </header>
        <div className="report-meta">
          <span>
            <b>Report period</b>
            {period}
          </span>
          <span>
            <b>Generated</b>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>
            <b>Prepared by</b>
            {report?.preparedBy || "EFX Creations team"}
          </span>
        </div>
        <section>
          <h2>Summary</h2>
          <Summary projects={projects} />
        </section>
        <section>
          <h2>Project details</h2>
          <Table
            size="small"
            rowKey="id"
            columns={reportColumns}
            dataSource={projects}
            pagination={false}
          />
        </section>
        <section className="report-payment">
          <h2>Financial / payment summary</h2>
          <Space size="large">
            <span>
              <b>Paid</b>
              {
                projects.filter((project) => project.paymentStatus === "Paid")
                  .length
              }
            </span>
            <span>
              <b>Partial</b>
              {
                projects.filter(
                  (project) => project.paymentStatus === "Partial",
                ).length
              }
            </span>
            <span>
              <b>Unpaid</b>
              {
                projects.filter(
                  (project) => project.paymentStatus === "Pending",
                ).length
              }
            </span>
          </Space>
        </section>
        <section>
          <h2>Notes</h2>
          <p>
            {projects.length
              ? "Review production assignments and payment follow-ups before the next scheduling meeting."
              : "No projects matched the selected filters."}
          </p>
        </section>
        <footer>
          {appConfig.name} · {appConfig.systemName} · Generated by{" "}
          {appConfig.name} {appConfig.systemName}
        </footer>
      </article>
    </Modal>
  );
}
