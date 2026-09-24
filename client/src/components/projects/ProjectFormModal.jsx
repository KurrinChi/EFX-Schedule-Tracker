import { Form, Input, Modal, Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { systemConfig } from "../../config/systemConfig";
export default function ProjectFormModal({
  open,
  project,
  clients,
  packages,
  services,
  onCancel,
  onSubmit,
  submitting = false,
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open)
      form.setFieldsValue(
        project
          ? {
              ...project,
              eventDate: dayjs(project.eventDate),
              startTime: dayjs(`2025-01-01T${project.startTime}`),
              endTime: dayjs(`2025-01-01T${project.endTime}`),
            }
          : { status: "Upcoming", paymentStatus: "Pending" },
      );
  }, [open, project, form]);
  const submit = (values) =>
    onSubmit({
      ...values,
      clientName: clients.find((x) => x.id === values.clientId)?.fullName,
      packageName: packages.find((x) => x.id === values.packageId)?.name,
      serviceName: services.find((x) => x.id === values.serviceId)?.name,
      eventDate: values.eventDate.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
    });
  return (
    <Modal
      open={open}
      title={project ? "Edit project" : "New project"}
      okText={project ? "Save changes" : "Create project"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <div className="form-grid">
          <Form.Item
            label="Client"
            name="clientId"
            rules={[{ required: true }]}
          >
            <Select
              options={clients.map((x) => ({ value: x.id, label: x.fullName }))}
            />
          </Form.Item>
          <Form.Item
            label="Project type"
            name="projectType"
            rules={[{ required: true }]}
          >
            <Select
              options={systemConfig.projectTypes.map((x) => ({
                value: x,
                label: x,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Package"
            name="packageId"
            rules={[{ required: true }]}
          >
            <Select
              options={packages.map((x) => ({ value: x.id, label: x.name }))}
            />
          </Form.Item>
          <Form.Item
            label="Service"
            name="serviceId"
            rules={[{ required: true }]}
          >
            <Select
              options={services.map((x) => ({ value: x.id, label: x.name }))}
            />
          </Form.Item>
          <Form.Item
            label="Event date"
            name="eventDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Start time"
            name="startTime"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="End time"
            name="endTime"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              options={systemConfig.projectStatuses.map((x) => ({
                value: x,
                label: x,
              }))}
            />
          </Form.Item>
          <Form.Item label="Payment status" name="paymentStatus">
            <Select
              options={systemConfig.paymentStatuses.map((x) => ({
                value: x,
                label: x,
              }))}
            />
          </Form.Item>
        </div>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
